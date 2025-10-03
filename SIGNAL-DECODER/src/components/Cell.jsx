export default function Cell({
  index,
  isFlashing,
  isSelected,
  revealed,
  correct,
  onClick,
}) {
  const classes = ["cell"];
  if (isFlashing) classes.push("flashing");
  if (isSelected) classes.push("selected");
  if (revealed) {
    if (correct && isSelected) classes.push("correct");
    if (!correct && isSelected) classes.push("wrong");
    if (correct && !isSelected) classes.push("missed");
  }

  return (
    <button className={classes.join(" ")} onClick={onClick}>
      {index}
    </button>
  );
}
