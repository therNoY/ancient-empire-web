import dialogType from "./chapterDialogType"
import eventBus from "./EventBus"
var chapterDialogDispather = {
    dispatch({ dialog_type, message }) {
        console.log(dialog_type);
        if (dialog_type == "winCondition") {
            eventBus.publish("showWinCondition", message);
        } else if (dialog_type == "disShowDialog") {
            eventBus.publish("disShowDialog");
        } else if (dialog_type == "gameWin") {
            eventBus.publish("gameWin", message);
        } else if (dialog_type == "gameOver") {
            eventBus.publish("gameOver", message);
        } else {
            eventBus.publish("showDialog", { dialog_type, message });
        }
    }
}

export default chapterDialogDispather;