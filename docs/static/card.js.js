// COPY FUNCTIONALITY
document.querySelectorAll('.copy-button').forEach(button => {
  button.addEventListener('click', () => {
    const codeBlock = button.nextElementSibling.nextElementSibling.querySelector('code');
    const text = codeBlock.innerText;
    navigator.clipboard.writeText(text).then(() => {
      button.innerText = "Copied!";
      setTimeout(() => button.innerText = "Copy", 1500);
    });
  });
});

// TOGGLE SHOW MORE / LESS
document.querySelectorAll('.toggle-button').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    card.classList.toggle('expanded');
    button.textContent = card.classList.contains('expanded') ? "Show Less" : "Show More";
  });
});
