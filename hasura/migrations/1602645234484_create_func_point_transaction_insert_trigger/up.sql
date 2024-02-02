CREATE OR REPLACE FUNCTION public.insert_transaction_insert_trigger ()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	AS $$
DECLARE
	currentPoint INTEGER := 0;
BEGIN
	LOCK TABLE public.point_transactions IN EXCLUSIVE MODE;
	IF NOT EXISTS (
			SELECT
				1
			FROM
				points
			WHERE
				user_id = NEW.user_id) THEN
			INSERT INTO "public".points (user_id)
				VALUES(NEW.user_id);
	END IF;
	IF tg_op = 'INSERT' THEN
		IF NEW.type_id = 'CHECKIN' OR NEW.type_id = 'COLLECT' OR NEW.type_id = 'INSTALL' THEN
			UPDATE
				points
			SET
				balance = balance + NEW.amount,
				total_earnings = total_earnings + NEW.amount
			WHERE
				user_id = NEW.user_id
			RETURNING
				balance INTO currentPoint;
		ELSIF NEW.type_id = 'EXCHANGE' THEN
			UPDATE
				points
			SET
				balance = balance + NEW.amount,
				total_exchange = total_exchange + NEW.amount
			WHERE
				user_id = NEW.user_id
			RETURNING
				balance INTO currentPoint;
		END IF;
		NEW.after_balance = currentPoint;
		NEW.before_balance = currentPoint - NEW.amount;
		RETURN NEW;
	ELSE
		RAISE EXCEPTION '% operation not permitted on this table', tg_op;
	END IF;
END;
$$;
