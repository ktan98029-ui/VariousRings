
import { world, ItemStack } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
function exchange(id) {
    let itemName = null;

    switch (id) {
        case "variousrings:iron_ring":
            itemName = "真鉄の指輪";
            break;

        case "variousrings:copper_ring":
            itemName = "赤金の指輪";
            break;

        case "variousrings:gold_ring":
            itemName = "金輝の指輪";
            break;

        case "variousrings:redstone_ring":
            itemName = "赤石の指輪";
            break;

        case "variousrings:lapis_ring":
            itemName = "青金石の指輪";
            break;

        case "variousrings:diamond_ring":
            itemName = "金剛石の指輪";
            break;

        case "variousrings:emerald_ring":
            itemName = "翠玉の指輪";
            break;

        case "variousrings:wither_ring":
            itemName = "衰弱の指輪";
            break;
    }

    return itemName;
}

export const RING_SLOT_CNT = 3;

// プレイヤーごとの装備情報を保存するMap
export const RING_SLOT_LIST = new Map();

// Dynamic Propertyの保存名
const RING_SLOT_PROPERTY = "variousrings:ring_slots";


// 保存データを読み込む
function loadRingSlotList(player) {

    const saved = player.getDynamicProperty(RING_SLOT_PROPERTY);

    let ringSlotList;

    if (typeof saved === "string") {
        try {
            ringSlotList = JSON.parse(saved);
        } catch {
            ringSlotList = null;
        }
    }

    // データが存在しない場合は初期化
    if (
        !Array.isArray(ringSlotList) ||
        ringSlotList.length !== RING_SLOT_CNT
    ) {
        ringSlotList = new Array(RING_SLOT_CNT).fill(null);
    }

    RING_SLOT_LIST.set(player.id, ringSlotList);

    return ringSlotList;
}


// 保存データを書き込む
function saveRingSlotList(player) {

    const ringSlotList = RING_SLOT_LIST.get(player.id);

    player.setDynamicProperty(
        RING_SLOT_PROPERTY,
        JSON.stringify(ringSlotList)
    );
}


// 指輪一覧を表示するUI
function showArtifactUI2(player, slot) {

    const form = new ActionFormData()
        .title("指輪選択")
        .body("装備する指輪を選択してください");

    const inventory = player.getComponent("minecraft:inventory");
    const container = inventory.container;

    const ringList = [
        "variousrings:copper_ring",
        "variousrings:iron_ring",
        "variousrings:gold_ring",
        "variousrings:redstone_ring",
        "variousrings:lapis_ring",
        "variousrings:emerald_ring",
        "variousrings:diamond_ring",
        "variousrings:wither_ring"
    ];

    let selectedRingList = [];
    let itemSlotList = [];
    let cnt = 0;
    let check = 0;

    for (let i = 0; i < ringList.length; i++) {

        let found = false;

        for (let j = 0; j < container.size; j++) {
            check = container.getItem(j);

            if (check?.typeId === ringList[i]) {
                found = true;
                itemSlotList.push(j);
                break;
            }
        }

        if (found) {
            selectedRingList.push(ringList[i]);
            form.button(exchange(ringList[i]));
            cnt++;
        }
    }

    form.button("取り外す");

    form.show(player).then((response) => {

        if (response.canceled) return;

        // プレイヤー自身の装備情報を取得
        const oldRing = RING_SLOT_LIST.get(player.id)[slot];

        // 取り外すボタンが押された場合
        if (response.selection === cnt) {

            if (oldRing !== null) {
                const item = new ItemStack(oldRing, 1);
                const leftover = container.addItem(item);
                player.playSound("mob.horse.armor");
                

                if (leftover !== undefined) {
                    player.dimension.spawnItem(leftover, player.location);
                }
            }

            RING_SLOT_LIST.get(player.id)[slot] = null;

            // 変更したデータを保存
            saveRingSlotList(player);

            return;
        }

        // 新しい指輪を装備する場合
        if (oldRing !== null) {
            const item = new ItemStack(oldRing, 1);
            const leftover = container.addItem(item);

            if (leftover !== undefined) {
                player.dimension.spawnItem(leftover, player.location);
            }
        }

        const index = response.selection;
        const item = container.getItem(itemSlotList[index]);

        if (item.amount > 1) {
            item.amount -= 1;
            container.setItem(itemSlotList[index], item);
        } else {
            container.setItem(itemSlotList[index], undefined);
        }

        //player.sendMessage(`装着：${exchange(selectedRingList[index])}`);

        RING_SLOT_LIST.get(player.id)[slot] = selectedRingList[index];

        // 変更したデータを保存
        saveRingSlotList(player);
        player.playSound("mob.horse.armor");

    });
}


// スロット選択
function showArtifactUI(player) {

    // 保存データを読み込む
    loadRingSlotList(player);

    const form = new ActionFormData()
        .title("指輪装備");

    for (let i = 0; i < RING_SLOT_CNT; i++) {

        if (RING_SLOT_LIST.get(player.id)[i] === null) {
            form.button(`指輪スロット${i + 1}: 空き`);
        }

        else {
            form.button(
                `指輪スロット${i + 1}: ${exchange(RING_SLOT_LIST.get(player.id)[i])}`
            );
        }

    }

    form.show(player).then((response) => {
        if (response.canceled) return;

        const slot = response.selection;
        showArtifactUI2(player, slot);

    });
}


world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;

    if (player.typeId !== "minecraft:player") return;

    if (item.typeId === "variousrings:artifact_book") {
        showArtifactUI(player);
    }
});
