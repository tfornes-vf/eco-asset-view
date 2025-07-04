-- Create a table to store investment data from Holded
CREATE TABLE public.holded_investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  return_percentage DECIMAL(8,4) NOT NULL DEFAULT 0,
  is_economic_activity BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL,
  account_code TEXT,
  description TEXT,
  investment_type TEXT, -- 'direct', 'indirect', 'cash', etc.
  sub_category TEXT, -- for middle ring classification
  detail_category TEXT, -- for outer ring classification
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(external_id)
);

-- Enable Row Level Security
ALTER TABLE public.holded_investments ENABLE ROW LEVEL SECURITY;

-- Create policies (public read access for now, can be restricted later)
CREATE POLICY "Anyone can view investments" 
ON public.holded_investments 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_holded_investments_updated_at
BEFORE UPDATE ON public.holded_investments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_holded_investments_external_id ON public.holded_investments(external_id);
CREATE INDEX idx_holded_investments_category ON public.holded_investments(category);
CREATE INDEX idx_holded_investments_is_economic_activity ON public.holded_investments(is_economic_activity);