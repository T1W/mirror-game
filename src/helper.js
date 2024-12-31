
class Helper {

	static align45Degrees(angle) {
		if(angle>Math.PI*2) {
			while(angle>Math.PI*2) {
				angle -= Math.PI*2;
			}
		} else if(angle<-Math.PI*2) {
			while(angle<-Math.PI*2) {
				angle += Math.PI*2;
			}
		}
				
		for(let newAngle = Math.PI*2; newAngle > -Math.PI*2; newAngle -= Math.PI/4) {
			if(Math.abs(newAngle - angle) <= Math.PI/8) {
				angle = newAngle;
				return angle;
			}
		}
		
		return angle;
	}
	
	static rectContains(x, y, xMin, yMin, xMax, yMax) {
		if(x >= xMin && x<= xMax && y>= yMin && y <= yMax) {
			return true;
		}
		return false;
	}
	
	static distance(x, y, x2, y2) {
		return Math.sqrt((x2-x) * (x2-x) + (y2-y) * (y2-y));
	}
	
	static distanceSquared(x, y, x2, y2) {
		return (x2-x) * (x2-x) + (y2-y) * (y2-y);
	}
	
	static circleContains(x, y, cX, cY, radius) {
		if((x-cX) ** 2 + (y-cY) **2 <= radius * radius) {
			return true;
		}
		return false;
	}
	
	static ringContains(x, y, cX, cY, radius, radius2) {
		let distance = (x-cX) ** 2 + (y-cY) **2;
		if(distance >= radius * radius && distance <= radius2 * radius2) {
			return true;
		}
		return false;
	}
	
	static rayIntersectsSegment(rayPoint, rayDirection, endpoint1, endpoint2) {
		
		let segmentDirection = [endpoint2[0] - endpoint1[0], endpoint2[1] - endpoint1[1]];
		let A = rayPoint[0];
		let B = rayPoint[1];
		let a = rayDirection[0];
		let b = rayDirection[1];
		let C = endpoint1[0];
		let D = endpoint1[1];
		let c = segmentDirection[0];
		let d = segmentDirection[1];
		let t = 0;
		let x = 0;
		let y = 0;
		
		/* ray is vertical */
		if(Math.abs(a) <= 0.01) {
			/* parallel or ray doesn't have direction somehow */
			if(c == 0 || b == 0) {
				return [false, [0, 0]];
			}
			
			t = (A - C)/c;
			
			/* t has to be between 0 and 1 to intersect with the line segment */
			if(t<0 || t>1) {
				return [false, [0, 0]];
			}
			
			y = D + d*t;
			
			/* ray is going down but the would-be intersection is above it*/
			if(b<0 && y>B) {
				return [false, [0, 0]];
			}
			/* ray is going up but the would-be intersection is below it*/
			if(b>0 && y<B) {
				return [false, [0, 0]];
			}
			
			x = C + c*t;
			return [true, [x, y]];
		}
		
		/* parallel */
		if(a*d == c*b) {
			return [false, [0, 0]];
		}
		
		/* segment doesn't have direction somehow */
		if(c == 0 && d == 0) {
			return [false, [0, 0]];
		}
		
		let numerator = (B + b*(C-A)/a - D);
		let denominator = (d - c*b/a);
		t = numerator/denominator;
		
		/* t has to be between 0 and 1 to intersect with the line segment */
		if(t<=0 || t>=1) {
			return [false, [0, 0]];
		}
		
		let T = (C + c*t - A)/a;
		
		if(T<=0) {
			return [false, [0, 0]];
		}
		
		x = C + c*t;
		y = D + d*t;
		
		return [true, [x, y]];
	}
	
	static rayIntersectsCircle(rayPoint, rayDirection, circleX, circleY, circleRadius) {
		
		let a = rayDirection[0];
		let b1 = rayPoint[0];
		let c = rayDirection[1];
		let d1 = rayPoint[1];
		let R = circleRadius * circleRadius;
		let h = circleX;
		let k = circleY;
		
		if(a == 0 && c == 0) {
			return [false, [0, 0]];
		}
		
		let b = b1 - h;
		let d = d1 - k;
		
		let A = a*a + c*c;
		let B = 2*(a*b + c*d);
		let C = b*b + d*d - R;
		
		let discriminant = B*B - (4*A*C);
		
		if(discriminant < 0) {
			return [false, [0, 0]];
		}
		
		let t1 = (-B + Math.sqrt(discriminant)) / (2*A);
		let t2 = t1;
		
		if(discriminant > 0) {
			t2 = (-B - Math.sqrt(discriminant)) / (2*A);
		}
		
		if(t1 <= 0 && t2 <= 0) {
			return [false, [0, 0]];
		}
		
		let t;
		
		if(t2 > 0) {
			t = t2;
		} else {
			t = t1;
		}
		
		let x = b1 + a*t;
		let y = d1 + c*t;
		
		return [true, [x, y]];
		
	}
}