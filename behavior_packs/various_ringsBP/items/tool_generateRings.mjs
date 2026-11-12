
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// =================================
// 共通設定
// =================================

const CONFIG = {
    formatVersion: "1.21.40",
    tag: "variousrings:ring",
    maxStackSize: 1,

    rings: [
        {
            id: "iron_ring",
            name: "鉄の指輪",
            texture: "iron_ring",
            color: "7"
        },
        {
            id: "copper_ring",
            name: "赤金の指輪",
            texture: "copper_ring",
            color: "n"
        },
        {
            id: "diamond_ring",
            name: "金剛石の指輪",
            texture: "diamond_ring",
            color: "b"
        },
        {
            id: "emerald_ring",
            name: "翠玉の指輪",
            texture: "emerald_ring",
            color: "a"
        },
        {
            id: "wither_ring",
            name: "衰弱の指輪",
            texture: "wither_ring",
            color: "8"
        },
        {
            id: "redstone_ring",
            name: "赤石の指輪",
            texture: "redstone_ring",
            color: "c"
        },
        {
            id: "gold_ring",
            name: "金輝の指輪",
            texture: "gold_ring",
            color: "6"
        },
        {
            id: "lapis_ring",
            name: "青金石の指輪",
            texture: "lapis_ring",
            color: "9"
        }
    ]
};

// =================================
// 保存先
// =================================

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(
    currentDir//,
    //"../various_RingsBP/items"
);

fs.mkdirSync(outputDir, { recursive: true });

// =================================
// JSON生成
// =================================

for (const ring of CONFIG.rings) {

    const itemData = {
        format_version: CONFIG.formatVersion,

        "minecraft:item": {
            description: {
                identifier: `variousrings:${ring.id}`,

                menu_category: {
                    category: "equipment"
                }
            },

            components: {
                "minecraft:display_name": {
                    value: `§${ring.color}§l${ring.name}`
                },

                "minecraft:icon": {
                    textures: {
                        default: ring.texture
                    }
                },

                "minecraft:tags": {
                    tags: [CONFIG.tag]
                },

                "minecraft:use_modifiers": {
                    use_duration: 0
                },

                "minecraft:max_stack_size": CONFIG.maxStackSize
            }
        }
    };

    const filePath = path.join(
        outputDir,
        `${ring.id}.json`
    );

    fs.writeFileSync(
        filePath,
        JSON.stringify(itemData, null, 4),
        "utf8"
    );

    console.log(`${ring.id}.json を生成しました`);
}

console.log("すべての指輪JSONの生成が完了しました！");
