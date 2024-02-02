CREATE INDEX restaurants_location_idx
  ON restaurants
  USING GIST (location);
