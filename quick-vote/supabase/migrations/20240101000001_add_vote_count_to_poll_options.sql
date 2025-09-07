-- Add vote_count column to poll_options table
ALTER TABLE public.poll_options
ADD COLUMN vote_count INT DEFAULT 0 NOT NULL;

-- Create a function to increment the vote count
CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.poll_options
    SET vote_count = vote_count + 1
    WHERE id = NEW.option_id;
    RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new vote is inserted
CREATE TRIGGER on_vote_insert
AFTER INSERT ON public.votes
FOR EACH ROW
EXECUTE FUNCTION increment_vote_count();

-- Create a function to decrement the vote count
CREATE OR REPLACE FUNCTION decrement_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.poll_options
    SET vote_count = vote_count - 1
    WHERE id = OLD.option_id;
    RETURN OLD;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a vote is deleted
CREATE TRIGGER on_vote_delete
AFTER DELETE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION decrement_vote_count();
