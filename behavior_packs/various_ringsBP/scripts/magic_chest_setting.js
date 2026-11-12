import { world } from "@minecraft/server";


world.afterEvents.playerInteractWithBlock.subscribe((event) => {
    const block = event.block;

    if(block.typeId !== "variousrings:magic_chest"){
        return;
    }

    //インベントリーを取得  

    const inventory = block.getComponent("minecraft:inventory");

    if(!inventory || !inventory.container){
        event.player.sendMessage("イベントを取得できませんでした");
        return;
    }

    const container = inventory.container;

    event.player.sendMessage(`スロット数:${container.size}`);
    event.player.sendMessage(`空きスロット:${container.emptySlotsCount}`);
})