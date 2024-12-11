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
                :context="context"
            />
        </template>

        <g v-if="innerRectangle"
            :style="`--rotation: ${innerRectangle[4]}deg;`"
            class="edit-layer"
        >
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
            <circle
                class="handler R"
                :cx="centerInnerRectangle[0]"
                :cy="centerInnerRectangle[1] - rotateHandleDistance"
                :r="12"
                @mousedown.stop="mouseDown($event, 'R')"
            />
            <line
                :x1="centerInnerRectangle[0]"
                :y1="centerInnerRectangle[1] - rotateHandleDistance"
                :x2="centerInnerRectangle[0]"
                :y2="centerInnerRectangle[1]"
                class="rotation-line"
            />
        </g>
    </svg>
</template>
<script setup lang="ts">

type Props = {
    back?: boolean;
    material: MaterialCard;
    rectangle?: RotationRectangle | boolean;
    content?: MaterialContent | null;
    context?: MaterialContext;
};

type MouseAction = 'none' | 'size' | 'move' | 'rotation';

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'rectangle', rect: RotationRectangle): void;
    (e: 'rectangleEnd', rect: RotationRectangle): void;
}>();

const cursorStyle = ref<string>('default');
const innerRectangle = ref<RotationRectangle | false>(false);
/** [<position & dimension>, <rotation center>] */
const refRect = ref<[Point, Point]>([[0, 0], [0, 0]]);
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

const rotateHandleDistance = computed(() => {
    const rect = innerRectangle.value;

    if (!rect) {
        return 10 * px;
    }

    return Math.min(
        10 * px,
        rect[3] / 2
    );
});

const propsRectangle = computed(() => props.rectangle);

const centerInnerRectangle = computed<Point>(() => {
    const rect = innerRectangle.value;

    if (!rect) {
        return [0, 0];
    }

    return centerOfRect(rect);
});

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

    const copyRect = rectangle.map((value) => value * px) as RotationRectangle;
    copyRect[4] = rectangle[4];

    innerRectangle.value = copyRect;
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

function externalRectangle(rect: RotationRectangle): RotationRectangle {
    const copyRect = rect.map((value) => value / px) as RotationRectangle;
    copyRect[4] = rect[4];

    return copyRect;
}

function mouseDown(event: MouseEvent, handler?: 'NE' | 'NW' | 'SE' | 'SW' | 'R') {
    if (!props.rectangle) {
        return;
    }

    const [x, y] = getXY(event);
    const rect = innerRectangle.value as RotationRectangle;
    const center = centerInnerRectangle.value.slice() as Point;

    switch (handler) {
        case 'NE':
            refRect.value = [
                [rect[0], rect[1] + rect[3]],
                center,
            ];
            break;
        case 'NW':
            refRect.value = [
                [rect[0] + rect[2], rect[1] + rect[3]],
                center,
            ];
            break;
        case 'SE':
            refRect.value = [
                [rect[0], rect[1]],
                center,
            ];
            break;
        case 'SW':
            refRect.value = [
                [rect[0] + rect[2], rect[1]],
                center,
            ];
            break;
        case 'R': {
            const center = centerInnerRectangle.value;

            refRect.value = [
                [center[0], center[1] - rotateHandleDistance.value],
                center,
            ];
            mouseAction.value = 'rotation';

            return;
        }
        default:
            if (!rect) {
                refRect.value = [[x, y], center];
                innerRectangle.value = [x, y, 0, 0, 0];
            } else {
                if (isInRectangle(x, y)) {
                    refRect.value = [
                        [x - rect[0], y - rect[1]],
                        center,
                    ];
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

    const [xMouse, yMouse] = getXY(event);

    if (mouseAction.value === 'none') {
        if (isInRectangle(xMouse, yMouse)) {
            cursorStyle.value = 'move';
        } else {
            cursorStyle.value = 'default';
        }

        return;
    }

    const [[xRef, yRef], center] = refRect.value;
    let newRect: RotationRectangle;

    switch (mouseAction.value) {
        case 'size': {
            const [ xMsCtx, yMsCtx ] = rotatePoint(
                [xMouse, yMouse],
                center,
                -rectangle[4],
            );

            const x = Math.min(xRef, xMsCtx);
            const y = Math.min(yRef, yMsCtx);

            const w = Math.abs(xRef - xMsCtx);
            const h = Math.abs(yRef - yMsCtx);
            const origRotation = rectangle[4];

            newRect = [x, y, w, h, origRotation];
            break;
        }
        case 'move': {
            const [,, w, h, r] = rectangle;

            newRect = [xMouse - xRef, yMouse - yRef, w, h, r];
            break;
        }
        case 'rotation': {
            const [x, y, w, h] = rectangle;
            const [ centerX, centerY ] = centerInnerRectangle.value;

            const angle = calculateAngle(
                [centerX, centerY],
                [xRef, yRef],
                [xMouse, yMouse],
            );

            const r = Math.round(angle + 360) % 360;

            newRect = [x, y, w, h, r];
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

.rotation-line {
    stroke: var(--selector-color1);
    stroke-width: 4;
    stroke-dasharray: 15 15;
    stroke-dashoffset: 0;
    fill: none;
}


.edit-layer {
    transform-box: fill-box;
    transform-origin: center;
    transform: rotate(var(--rotation, 0));
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
.R {
    cursor: grab;
}
</style>
