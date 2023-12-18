let checkCircleSquareCollision = (circle, square) => {
    // Calculate the half side length of the square
    let halfSideLength = square.radius;

    // Find the closest point on the square to the circle's center
    let closestX = clamp(circle.x, square.x - halfSideLength, square.x + halfSideLength);
    let closestY = clamp(circle.y, square.y - halfSideLength, square.y + halfSideLength);

    // Calculate the distance between the circle's center and the closest point
    let distanceX = circle.x - closestX;
    let distanceY = circle.y - closestY;
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Return true if the distance is less than or equal to the circle's radius
    return distance <= circle.radius;
}

// Helper function to constrain a value between a min and max
let clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
}