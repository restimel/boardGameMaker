<template>
    <svg
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        class="card"
        :style="cssVariables"
        ref="svg"

        @mousedown="mouseDown"
        @mouseup="mouseUp"
        @mousemove="mouseMove"
    >
        <template v-for="detail of details" :key="`detail-${detail.id}`">
            <SVGContent
                :value="detail"
                :px="px"
                :material="material"
                :content="content"
            />
        </template>

        <g v-if="innerRectangle">
            <rect
                :x="innerRectangle[0]"
                :y="innerRectangle[1]"
                :width="innerRectangle[2]"
                :height="innerRectangle[3]"
                class="draw-rect"
            />
            <rect
                :x="innerRectangle[0]"
                :y="innerRectangle[1]"
                :width="innerRectangle[2]"
                :height="innerRectangle[3]"
                class="draw-rect-bis"
            />
            <rect
                class="handler NW"
                :x="innerRectangle[0] - 10"
                :y="innerRectangle[1] - 10"
                :width="20"
                :height="20"
                @mousedown.stop="mouseDown($event, 'NW')"
            />
            <rect
                class="handler NE"
                :x="innerRectangle[0] + innerRectangle[2] - 10"
                :y="innerRectangle[1] - 10"
                :width="20"
                :height="20"
                @mousedown.stop="mouseDown($event, 'NE')"
            />
            <rect
                class="handler SE"
                :x="innerRectangle[0] + innerRectangle[2] - 10"
                :y="innerRectangle[1] + innerRectangle[3] - 10"
                :width="20"
                :height="20"
                @mousedown.stop="mouseDown($event, 'SE')"
            />
            <rect
                class="handler SW"
                :x="innerRectangle[0] - 10"
                :y="innerRectangle[1] + innerRectangle[3] - 10"
                :width="20"
                :height="20"
                @mousedown.stop="mouseDown($event, 'SW')"
            />
        </g>
    </svg>
</template>
<script setup lang="ts">

type Props = {
    back?: boolean;
    material: MaterialCard;
    rectangle?: Rectangle | boolean;
    content?: MaterialContent | null;
};

type MouseAction = 'none' | 'size' | 'move';

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'rectangle', rect: Rectangle): void;
    (e: 'rectangleEnd', rect: Rectangle): void;
}>();

const cursorStyle = ref<string>('default');
const innerRectangle = ref<Rectangle | false>(false);
const refRect = ref<[number, number]>([0, 0]);
const mouseAction = ref<MouseAction>('none');

const svg = useTemplateRef<SVGElement>('svg');

const px = 10;
const width = computed(() => {
    return props.material.dimension[0];
});
const height = computed(() => {
    return props.material.dimension[1];
});

const svgWidth = computed(() => {
    return width.value * px;
});
const svgHeight = computed(() => {
    return height.value * px;
});

const ratioX = computed(() => {
    const sizeX = svg.value?.clientWidth ?? 1;
    const innerX = svgWidth.value;

    return innerX / sizeX;
});
const ratioY = computed(() => {
    const sizeY = svg.value?.clientHeight ?? 1;
    const innerY = svgHeight.value;

    return innerY / sizeY;
});

const propsRectangle = computed(() => props.rectangle);

const cssVariables = computed(() => {
    return `
        --width: ${width.value}mm;
        --height: ${height.value}mm;
        --card-color: ${props.material.backgroundColor};
        --cursor: ${cursorStyle.value};
    `;
});

const details = computed<MetaMaterial[]>(() => {
    if (props.back) {
        return props.material.back;
    }

    return props.material.front;
});

watch(propsRectangle, () => {
    const rectangle = props.rectangle;

    if (!rectangle) {
        innerRectangle.value = false;
        cursorStyle.value = 'default';
        return;
    }

    if (rectangle === true) {
        innerRectangle.value = false;
        cursorStyle.value = 'default';
        return;
    }

    innerRectangle.value = rectangle.map((value) => value * px) as Rectangle;
}, { immediate: true });

function getXY(event: MouseEvent): [number, number] {
    const element = svg.value;

    if (!element) {
        return [0, 0];
    }

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return [x * ratioX.value, y * ratioY.value];
}

function isInRectangle(x: number, y: number) {
    const rect = innerRectangle.value;

    if (!rect) {
        return false;
    }

    const isInX = x >= rect[0] && x <= rect[0] + rect[2];
    const isInY = y >= rect[1] && y <= rect[1] + rect[3];

    return isInX && isInY;
}

function externalRectangle(rect: Rectangle): Rectangle {
    return rect.map((value) => value / px) as Rectangle;
}

function mouseDown(event: MouseEvent, handler?: 'NE' | 'NW' | 'SE' | 'SW') {
    if (!props.rectangle) {
        return;
    }

    const [x, y] = getXY(event);
    const rect = innerRectangle.value as Rectangle;

    switch (handler) {
        case 'NE':
            refRect.value = [rect[0], rect[1] + rect[3]];
            break;
        case 'NW':
            refRect.value = [rect[0] + rect[2], rect[1] + rect[3]];
            break;
        case 'SE':
            refRect.value = [rect[0], rect[1]];
            break;
        case 'SW':
            refRect.value = [rect[0] + rect[2], rect[1]];
            break;
        default:
            if (!rect) {
                refRect.value = [x, y];
                innerRectangle.value = [x, y, 0, 0];
            } else {
                if (isInRectangle(x, y)) {
                    refRect.value = [x - rect[0], y - rect[1]];
                    mouseAction.value = 'move';
                }

                return;
            }
    }

    mouseAction.value = 'size';
}

function mouseUp() {
    if (mouseAction.value === 'none') {
        return;
    }

    mouseAction.value = 'none';

    const rect = innerRectangle.value;
    if (rect) {
        emit('rectangleEnd', externalRectangle(rect));
    }
}

function mouseMove(event: MouseEvent) {
    const rectangle = innerRectangle.value;
    if (!rectangle || !props.rectangle) {
        return;
    }

    const [x2, y2] = getXY(event);

    if (mouseAction.value === 'none') {
        if (isInRectangle(x2, y2)) {
            cursorStyle.value = 'move';
        } else {
            cursorStyle.value = 'default';
        }

        return;
    }

    const [x1, y1] = refRect.value;
    let newRect: Rectangle;

    switch (mouseAction.value) {
        case 'size': {
            const x = Math.min(x1, x2);
            const y = Math.min(y1, y2);
            const w = Math.abs(x1 - x2);
            const h = Math.abs(y1 - y2);

            newRect = [x, y, w, h];
            break;
        }
        case 'move': {
            const [,, w, h] = rectangle;

            newRect = [x2 - x1, y2 - y1, w, h];
            break;
        }
    }

    innerRectangle.value = newRect;
    emit('rectangle', externalRectangle(newRect));
}

</script>
<style scoped>
.card {
    width: var(--width);
    height: var(--height);
    background-color: var(--card-color);
    cursor: var(--cursor);
}

svg {
    margin: 0;
    --selector-color1: blue;
    --selector-color2: white;
}

.draw-rect {
    stroke: var(--selector-color1);
    stroke-width: 4;
    stroke-dasharray: 15 15;
    stroke-dashoffset: 0;
    fill: none;
}
.draw-rect-bis {
    stroke: var(--selector-color2);
    stroke-width: 2;
    stroke-dasharray: 15 15;
    stroke-dashoffset: 15;
    fill: none;
}
.handler {
    fill: var(--selector-color1);
    stroke: white;
    stroke-width: 1;
}

.NE {
    cursor: ne-resize;
}
.SE {
    cursor: se-resize;
}
.NW {
    cursor: nw-resize;
}
.SW {
    cursor: sw-resize;
}
</style>
