/**
 * Form error alert component.
 */

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3">
      <p className="text-sm font-medium text-red-800">{message}</p>
    </div>
  );
}
