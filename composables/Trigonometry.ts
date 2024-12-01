
function DegreeToRadian(value: number): number {
    return value * (Math.PI / 180);
}

function RadianToDegree(value: number): number {
    return value * (180 / Math.PI);
}

/** Compute the angle between 3 points in degree [-180, 180] */
export function calculateAngle(A: Point, B: Point, C: Point): number {
    /* Vectors */
    const AB = { x: B[0] - A[0], y: B[1] - A[1] };
    const AC = { x: C[0] - A[0], y: C[1] - A[1] };

    const dotProduct = AB.x * AC.x + AB.y * AC.y;

    /* Normalization */
    const magnitudeAB = Math.sqrt(AB.x ** 2 + AB.y ** 2);
    const magnitudeAC = Math.sqrt(AC.x ** 2 + AC.y ** 2);

    /* compute angle */
    const cosAlpha = dotProduct / (magnitudeAB * magnitudeAC);
    const angleRadians = Math.acos(cosAlpha);
    const angleDegrees = RadianToDegree(angleRadians);

    /* orientation */
    const crossProduct = AB.x * AC.y - AB.y * AC.x;
    if (crossProduct < 0) {
        return -angleDegrees;
    }

    return angleDegrees;
}

/** Rotate a point around a center.
 * The angle is in Degree
 */
export function rotatePoint(point: Point, center: Point, angle: number): Point {
    const angleRadian = DegreeToRadian(angle);

    /* Center is now the referential 0,0 */
    const x = point[0] - center[0];
    const y = point[1] - center[1];

    /* rotate point */
    const newX = Math.cos(angleRadian) * x - Math.sin(angleRadian) * y;
    const newY = Math.cos(angleRadian) * y + Math.sin(angleRadian) * x;

    /* restore referential */
    const finalX = newX + center[0];
    const finalY = newY + center[1];

    return [ finalX, finalY ];
}

export function centerOfRect(rect: Rectangle | RotationRectangle): Point {
    const x = rect[0] + rect[2] / 2;
    const y = rect[1] + rect[3] / 2;

    return [x, y];
}
