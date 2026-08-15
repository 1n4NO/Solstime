export function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="add-button" type="button" aria-label="Add a new plan" onClick={onClick}>
      <span aria-hidden="true">+</span>
    </button>
  );
}
