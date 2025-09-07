import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(request, { params }) {
  try {
    console.log("GET /api/polls/[id] - Poll ID:", params.id);
    console.log("Environment check:", {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

    const cookieStore = cookies();
    const supabase = createServerSupabaseClient(cookieStore);
    const pollId = params.id;

    // Get the poll with its options
    const { data: poll, error: pollError } = await supabase
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
      .eq("id", pollId)
      .single();

    if (pollError || !poll) {
      console.error("Poll fetch error:", pollError);
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    console.log("Poll found:", {
      id: poll.id,
      title: poll.title,
      created_by: poll.created_by,
    });

    // Get vote counts for each option
    const optionsWithVotes = await Promise.all(
      poll.poll_options.map(async (option) => {
        const { count, error: voteError } = await supabase
          .from("votes")
          .select("id", { count: "exact" })
          .eq("option_id", option.id);

        if (voteError) {
          console.error("Vote count error for option:", option.id, voteError);
        }

        return {
          ...option,
          votes: count || 0,
        };
      }),
    );

    const pollWithVotes = {
      ...poll,
      options: optionsWithVotes,
    };

    return NextResponse.json({
      success: true,
      poll: pollWithVotes,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const cookieStore = cookies();
    const supabase = createServerSupabaseClient(cookieStore);
    const { title, description, options } = await request.json();
    const pollId = params.id;

    console.log("PUT Request Data:", {
      title,
      description,
      options,
      optionsLength: options?.length,
      pollId,
    });

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("PUT /api/polls/[id] - Auth check:", {
      hasUser: !!user,
      userId: user?.id,
      authError: authError?.message,
    });

    if (authError || !user) {
      console.error("Authentication failed:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    // Check if the poll exists and user owns it
    const { data: existingPoll, error: pollCheckError } = await supabase
      .from("polls")
      .select("id, created_by")
      .eq("id", pollId)
      .eq("created_by", user.id)
      .single();

    console.log("Ownership check:", {
      pollExists: !!existingPoll,
      pollCreator: existingPoll?.created_by,
      currentUser: user.id,
      isOwner: existingPoll?.created_by === user.id,
    });

    if (pollCheckError || !existingPoll) {
      console.error("Poll ownership check failed:", pollCheckError);
      return NextResponse.json(
        { error: "Poll not found or you do not have permission to edit it" },
        { status: 404 },
      );
    }

    // Check if poll has any votes (for safety - we'll only allow title/description edits if there are votes)
    const {
      data: voteData,
      count: voteCount,
      error: voteCountError,
    } = await supabase
      .from("votes")
      .select("id", { count: "exact" })
      .eq("poll_id", pollId);

    if (voteCountError) {
      console.error("Vote count error:", voteCountError);
    }

    const hasVotes = (voteCount || 0) > 0;

    console.log("Vote check:", {
      voteCount,
      hasVotes,
      hasOptions: !!options,
      optionsArray: Array.isArray(options),
      optionsLength: options?.length,
    });

    // Update the poll
    const { data: updatedPoll, error: updateError } = await supabase
      .from("polls")
      .update({
        title: title.trim(),
        description: description.trim(),
      })
      .eq("id", pollId)
      .eq("created_by", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Poll update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update poll" },
        { status: 500 },
      );
    }

    // If there are no votes and options are provided, update the options
    console.log("Checking option update conditions:", {
      noVotes: !hasVotes,
      hasOptions: !!options,
      isArray: Array.isArray(options),
      willUpdateOptions: !hasVotes && options && Array.isArray(options),
    });

    if (!hasVotes && options && Array.isArray(options)) {
      const validOptions = options.filter((option) => option.trim() !== "");

      if (validOptions.length < 2) {
        return NextResponse.json(
          { error: "At least 2 valid options are required" },
          { status: 400 },
        );
      }

      // Delete existing options
      const { error: deleteError } = await supabase
        .from("poll_options")
        .delete()
        .eq("poll_id", pollId);

      console.log(
        "Deleting existing options for poll:",
        pollId,
        "Error:",
        deleteError,
      );

      if (deleteError) {
        console.error("Options delete error:", deleteError);
        return NextResponse.json(
          { error: "Failed to update options" },
          { status: 500 },
        );
      }

      // Insert new options
      const optionsToInsert = validOptions.map((text) => ({
        poll_id: pollId,
        text: text.trim(),
      }));

      const { data: newOptions, error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionsToInsert)
        .select();

      console.log(
        "Inserting new options:",
        optionsToInsert,
        "Error:",
        optionsError,
        "Result:",
        newOptions,
      );

      if (optionsError) {
        console.error("Options creation error:", optionsError);
        return NextResponse.json(
          { error: "Failed to update options" },
          { status: 500 },
        );
      }

      // Return poll with new options
      return NextResponse.json({
        success: true,
        poll: {
          ...updatedPoll,
          options: newOptions.map((option) => ({
            ...option,
            votes: 0,
          })),
        },
        message: "Poll updated successfully",
      });
    }

    // If poll has votes, only return the updated poll info (options unchanged)
    const { data: existingOptions } = await supabase
      .from("poll_options")
      .select("*")
      .eq("poll_id", pollId);

    return NextResponse.json({
      success: true,
      poll: {
        ...updatedPoll,
        options: existingOptions || [],
      },
      message: hasVotes
        ? "Poll title and description updated (options unchanged due to existing votes)"
        : "Poll updated successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = cookies();
    const supabase = createServerSupabaseClient(cookieStore);
    const pollId = params.id;

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the poll exists and user owns it
    const { data: existingPoll, error: pollCheckError } = await supabase
      .from("polls")
      .select("id, created_by")
      .eq("id", pollId)
      .eq("created_by", user.id)
      .single();

    if (pollCheckError || !existingPoll) {
      return NextResponse.json(
        { error: "Poll not found or you do not have permission to delete it" },
        { status: 404 },
      );
    }

    // Delete the poll (this will cascade delete options and votes due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from("polls")
      .delete()
      .eq("id", pollId)
      .eq("created_by", user.id);

    if (deleteError) {
      console.error("Poll delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete poll" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Poll deleted successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
