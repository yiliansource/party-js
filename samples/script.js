party.settings.debug = true;

document.body.addEventListener("click", function (e) {
    e.preventDefault();
    party.confetti(e);
});
document.body.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    party.sparkles(e);
});
