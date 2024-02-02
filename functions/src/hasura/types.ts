// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
type EventHS<T = any> = {
  session_variables: Record<string, string> | null;
  op: 'INSERT' | 'UPDATE' | 'DELETE' | 'MANUAL';
  data: {
    old: T | Record<string, any> | null;
    new: T | Record<string, any> | null;
  };
};

type Payload = {
  action?: {
    name: string;
  };
  trigger?: {
    name: string;
  };
  name?: string;
};

type Action<T> = {
  action: {
    name: string;
  };
  input?: T;
  session_variables: Record<string, string> | null;
};

type EventTrigger<T = any> = {
  event: EventHS<T>;
  created_at: string;
  id: string;
  trigger: {
    name: string;
  };
  table: {
    schema: string;
    name: string;
  };
};
