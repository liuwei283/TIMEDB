import * as $ from "jquery";
function addRmBtnAction() {
    $(".btn-rm-opt").each(function() {
        const rmBtn = $(this);
        const group = rmBtn.parents(".input-group");
        rmBtn.off("click").on("click", () => {
            group.remove();
        });
    });
}

function fixIndex() {
    $(".form-opt-container .input-group.fresh").each(function() {
        const optGroup = $(this);
        const index = optGroup.index().toString();
        optGroup.find("[name]").each(function() {
            const input = this as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            input.name = input.name.replace(/_id_/g, index);
        });
        optGroup.removeClass("fresh");
    });
}

$(".btn-add-opt").each(function() {
    const addBtn = $(this);
    const container = addBtn.siblings(".form-opt-container")[0];
    const template = addBtn.siblings("template")[0] as HTMLTemplateElement;
    addBtn.on("click", (e) => {
        container.appendChild(document.importNode(template.content, true));
        addRmBtnAction();
        fixIndex();
    });

});