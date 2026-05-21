import { createClient } from "@/utils/supabase/server";

export default async function SupabaseExamplePage() {
  const supabase = await createClient();
  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="section-card soft-shadow rounded-3xl p-6 sm:p-8">
        <h1 className="font-display text-3xl text-primary sm:text-4xl">Supabase Todo Eksempel</h1>
        {error ? (
          <p className="mt-3 text-sm text-rose-700">Kunne ikke hente todos: {error.message}</p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {todos?.map((todo) => (
              <li key={todo.id} className="rounded-lg border border-border-soft bg-text-light/80 px-3 py-2 text-sm">
                {todo.name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
