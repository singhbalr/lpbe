CREATE TRIGGER point_transaction_insert_trigger BEFORE INSERT OR DELETE OR UPDATE ON public.point_transactions FOR EACH ROW EXECUTE FUNCTION public.insert_transaction_insert_trigger();
