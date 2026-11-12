import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import "./artifactui.js";
import "./artifact_effect.js";


world.afterEvents.itemUse.subscribe((event) => {

    // 使用したアイテムを取得
    const item = event.itemStack;

    // 棒以外なら処理を終了
    if (item.typeId !== "minecraft:stick") {
        return;
    }

    // 使用したプレイヤーを取得
    const player = event.source;

    // プレイヤーの座標を取得
    const location = player.location;

    // 構造物を設置する
    world.structureManager.place(
        "variousrings:wizard_house",
        player.dimension,
        {
            x: Math.floor(location.x) + 3,
            y: Math.floor(location.y),
            z: Math.floor(location.z)
        }
    );

    player.sendMessage("構造物を設置しました！");
});