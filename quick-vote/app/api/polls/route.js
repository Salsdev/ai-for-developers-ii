import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
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
    const { title, description, options, expiresAt } = await request.json();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    if (!title || !description || !options || options.length < 2) {
      return NextResponse.json(
        { error: "Title, description, and at least 2 options are required" },
        { status: 400 },
      );
    }

    // Filter out empty options
    const validOptions = options.filter((option) => option.trim() !== "");

    if (validOptions.length < 2) {
      return NextResponse.json(
        { error: "At least 2 valid options are required" },
        { status: 400 },
      );
    }

    // Create the poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        title: title.trim(),
        description: description.trim(),
        created_by: user.id,
        expires_at: expiresAt || null,
      })
      .select()
      .single();

    if (pollError) {
      console.error("Poll creation error:", pollError);
      return NextResponse.json(
        { error: "Failed to create poll" },
        { status: 500 },
      );
    }

    // Create poll options
    const optionsToInsert = validOptions.map((text) => ({
      poll_id: poll.id,
      text: text.trim(),
    }));

    const { data: createdOptions, error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionsToInsert)
      .select();

    if (optionsError) {
      console.error("Options creation error:", optionsError);
      // Clean up the poll if options creation failed
      await supabase.from("polls").delete().eq("id", poll.id);
      return NextResponse.json(
        { error: "Failed to create poll options" },
        { status: 500 },
      );
    }

    // Return the complete poll data
    const pollWithOptions = {
      ...poll,
      options: createdOptions.map((option) => ({
        ...option,
        votes: 0,
      })),
    };

    return NextResponse.json(
      {
        success: true,
        poll: pollWithOptions,
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

export async function GET() {
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

    // Get all active polls with their options
    const { data: polls, error: pollsError } = await supabase
      .from("polls")
      .select(
        `
        *,
        poll_options (
          id,
          text,
          created_at
        )
      `,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (pollsError) {
      console.error("Polls fetch error:", pollsError);
      return NextResponse.json(
        { error: "Failed to fetch polls" },
        { status: 500 },
      );
    }

    // Get vote counts for each option
    const pollsWithVotes = await Promise.all(
      polls.map(async (poll) => {
        const optionsWithVotes = await Promise.all(
          poll.poll_options.map(async (option) => {
            const { count } = await supabase
              .from("votes")
              .select("*", { count: "exact", head: true })
              .eq("option_id", option.id);

            return {
              ...option,
              votes: count || 0,
            };
          }),
        );

        return {
          ...poll,
          options: optionsWithVotes,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      polls: pollsWithVotes,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
