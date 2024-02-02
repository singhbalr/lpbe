CREATE OR REPLACE FUNCTION nearby_restaurants (lon DECIMAL, lat DECIMAL, distance_meters INTEGER)
	RETURNS SETOF restaurants
	AS $$
	SELECT
		*
	FROM
		restaurants
	WHERE
		st_dwithin ("location", (ST_SetSRID (ST_Point (lon, lat), 4326))::geography, distance_meters)
	ORDER BY
		st_distance("location", (ST_SetSRID (ST_Point (lon, lat), 4326))::geography)
$$
LANGUAGE sql
STABLE;
