import { RING_SLOT_LIST } from "./artifactui.js";
import { world, system } from "@minecraft/server";

export const PLAYER_EFFECTS = new Map();

const RING_ORDER = [
    "COPPER",
    "IRON",
    "GOLD",
    "LAPIS",
    "REDSTONE",
    "EMERALD",
    "DIAMOND",
    "WITHER"
];

const RING = new Map();

for (let i = 0; i < RING_ORDER.length; i++) {
    RING.set(RING_ORDER[i], 1 << i);
}

function exchange(item) {
    switch (item) {
        case "variousrings:copper_ring": return RING.get("COPPER");
        case "variousrings:iron_ring": return RING.get("IRON");
        case "variousrings:gold_ring": return RING.get("GOLD");
        case "variousrings:lapis_ring": return RING.get("LAPIS");
        case "variousrings:redstone_ring": return RING.get("REDSTONE");
        case "variousrings:emerald_ring": return RING.get("EMERALD");
        case "variousrings:diamond_ring": return RING.get("DIAMOND");
        case "variousrings:wither_ring": return RING.get("WITHER");
        default: return 0;
    }
}


function hasArtifactBook(player) {
    const inventory = player.getComponent("minecraft:inventory");

    if (!inventory) return false;

    const container = inventory.container;

    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);

        if (item?.typeId === "variousrings:artifact_book") {
            return true;
        }
    }

    return false;
}



function effects(effectFlags, player) {

    if (effectFlags & RING.get("COPPER")) {
        player.addEffect("minecraft:haste", 5, {
            amplifier: 0,
            showParticles: false
        });
    }

    if (effectFlags & RING.get("IRON")) {
        player.addEffect("minecraft:speed", 20, {
            amplifier: 0,
            showParticles: false
        });
    }

    if (effectFlags & RING.get("GOLD")) {
        player.addEffect("minecraft:slow_falling", 20, {
            amplifier: 0,
            showParticles: false
        });
    }

    if (effectFlags & RING.get("LAPIS")) {
        player.addEffect("minecraft:regeneration", 20, {
            amplifier: 0,
            showParticles: false
        });
    }

    if (effectFlags & RING.get("REDSTONE")) {
        player.addEffect("minecraft:strength", 20, {
            amplifier: 0,
            showParticles: false
        });
    }

    if (effectFlags & RING.get("EMERALD")) {
        player.addEffect("minecraft:village_hero", 20, {
            amplifier: 0,
            showParticles: false
        });
    }

    if (effectFlags & RING.get("DIAMOND")) {
        player.addEffect("minecraft:resistance", 20, {
            amplifier: 0,
            showParticles: false
        });
    }  
}

world.afterEvents.entityHitEntity.subscribe((event) => {

    const attacker = event.damagingEntity;
    const attacked = event.hitEntity

    if(!(PLAYER_EFFECTS.get(attacker.id) & RING.get("WITHER"))){return;}

    if(attacker.typeId != "minecraft:player"){return;}
    if(attacked.typeId === "minecraft:player"){return;}

    attacked.addEffect("minecraft:wither",200,{
        amplifier: 2,
        showParticles: false
    })
})




system.runInterval(() => {
    const players = world.getAllPlayers();

    for (const player of players) {
        let effectFlags = 0;

        const ringList = RING_SLOT_LIST.get(player.id);

        if (!hasArtifactBook(player)) {
            PLAYER_EFFECTS.set(player.id, 0);
            continue;
        }

        if (!ringList) {
            PLAYER_EFFECTS.set(player.id, effectFlags);
            continue;
        }

        for (const item of ringList) {
            if (item === null) continue;

            effectFlags |= exchange(item);
        }

        PLAYER_EFFECTS.set(player.id, effectFlags);

        effects(effectFlags, player);
    }
}, 5);

world.afterEvents.playerLeave.subscribe((event) => {
    PLAYER_EFFECTS.delete(event.playerId);
});

