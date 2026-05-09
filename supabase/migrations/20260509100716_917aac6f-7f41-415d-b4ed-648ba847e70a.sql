
CREATE TABLE public.postal_codes (
  postal_code text PRIMARY KEY,
  town text NOT NULL,
  province text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.postal_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Postal codes are publicly readable"
ON public.postal_codes
FOR SELECT
USING (true);

CREATE TRIGGER update_postal_codes_updated_at
BEFORE UPDATE ON public.postal_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.postal_codes (postal_code, town, province) VALUES
  ('08001', 'Barcelona', 'Barcelona'),
  ('08380', 'Malgrat de Mar', 'Barcelona'),
  ('08301', 'Mataró', 'Barcelona'),
  ('08400', 'Granollers', 'Barcelona'),
  ('08201', 'Sabadell', 'Barcelona'),
  ('08221', 'Terrassa', 'Barcelona'),
  ('08800', 'Vilanova i la Geltrú', 'Barcelona'),
  ('08850', 'Gavà', 'Barcelona'),
  ('08901', 'L''Hospitalet de Llobregat', 'Barcelona'),
  ('08940', 'Cornellà de Llobregat', 'Barcelona');
