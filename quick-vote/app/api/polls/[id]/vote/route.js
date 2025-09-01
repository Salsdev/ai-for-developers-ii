import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      },
    );
    const { optionId } = await request.json();
    const pollId = params.id;

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    if (!optionId || !pollId) {
      return NextResponse.json(
        { error: "Poll ID and option ID are required" },
        { status: 400 },
      );
    }

    // Check if poll exists and is active
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("id, is_active, expires_at")
      .eq("id", pollId)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    if (!poll.is_active) {
      return NextResponse.json(
        { error: "Poll is not active" },
        { status: 400 },
      );
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return NextResponse.json({ error: "Poll has expired" }, { status: 400 });
    }

    // Check if user has already voted on this poll
    const { data: existingVote, error: voteCheckError } = await supabase
      .from("votes")
      .select("id")
      .eq("poll_id", pollId)
      .eq("user_id", user.id)
      .single();

    if (voteCheckError && voteCheckError.code !== "PGRST116") {
      console.error("Vote check error:", voteCheckError);
      return NextResponse.json(
        { error: "Error checking existing vote" },
        { status: 500 },
      );
    }

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted on this poll" },
        { status: 400 },
      );
    }

    // Verify the option belongs to this poll
    const { data: option, error: optionError } = await supabase
      .from("poll_options")
      .select("id")
      .eq("id", optionId)
      .eq("poll_id", pollId)
      .single();

    if (optionError || !option) {
      return NextResponse.json(
        { error: "Invalid option for this poll" },
        { status: 400 },
      );
    }

    // Cast the vote
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .insert({
        poll_id: pollId,
        user_id: user.id,
        option_id: optionId,
      })
      .select()
      .single();

    if (voteError) {
      console.error("Vote creation error:", voteError);
      return NextResponse.json(
        { error: "Failed to cast vote" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        vote: vote,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
