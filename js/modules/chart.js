export function updateChart(totals) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = 8;
    const spacing = 4; // Visual gap in pixels
    const minArcLength = strokeWidth + spacing + 3; // Minimum length to ensure visibility without overlap issues

    const keys = ['savings', 'investment', 'expenses', 'subscriptions', 'emergency'];
    const activeKeys = keys.filter(k => totals[k] > 0);
    const totalAmount = Object.values(totals).reduce((a, b) => a + b, 0);

    // Hide inactive rings
    keys.forEach(k => {
        if (!activeKeys.includes(k)) {
            const ring = document.getElementById(`ring-${k}`);
            const container = document.getElementById(`container-${k}`);
            const labelEl = document.getElementById(`label-${k}`);
            if (ring) {
                ring.style.opacity = '0';
                ring.setAttribute('stroke-dasharray', `0 ${circumference}`);
            }
            if (container) container.style.opacity = '0';
            if (labelEl) labelEl.innerText = '0%';
        }
    });

    if (activeKeys.length === 0) return;

    // Calculate raw target lengths based on value
    let segments = activeKeys.map(key => {
        const ratio = totalAmount > 0 ? totals[key] / totalAmount : 0;
        return {
            key,
            ratio,
            targetLength: ratio * circumference,
            isSmall: false
        };
    });

    // Enforce minimum segment size for visibility
    if (activeKeys.length > 1) {
        let reservedLength = 0;
        let scalableLength = 0;

        // 1. Identify small segments and reserve space
        segments.forEach(s => {
            if (s.targetLength < minArcLength) {
                s.isSmall = true;
                s.finalLength = minArcLength;
                reservedLength += minArcLength;
            } else {
                scalableLength += s.targetLength;
            }
        });

        // 2. Scale the remaining segments to fit available space
        const availableSpace = circumference - reservedLength;
        const scaleFactor = scalableLength > 0 ? availableSpace / scalableLength : 0;

        segments.forEach(s => {
            if (!s.isSmall) {
                s.finalLength = s.targetLength * scaleFactor;
            }
        });
    } else {
        // Single segment gets full circle
        segments[0].finalLength = circumference;
    }

    // Render segments
    let currentOffset = 0; // Starts at 12 o'clock (-90deg in CSS)
    const baseLabelDistance = 58;

    segments.forEach(seg => {
        const ring = document.getElementById(`ring-${seg.key}`);
        const container = document.getElementById(`container-${seg.key}`);
        const labelEl = document.getElementById(`label-${seg.key}`);

        if (labelEl) labelEl.innerText = (seg.ratio * 100).toFixed(1) + '%';
        
        if (ring && container) {
            ring.style.opacity = '1';
            container.style.opacity = '1';

            let dashVal, dashOffset;

            if (activeKeys.length === 1) {
                // Full circle: just dash it full, gap is implied by end
                dashVal = circumference; 
                dashOffset = 0;
            } else {
                // To create a gap of 'spacing' between segments with round caps:
                // Visual Start = currentOffset + spacing/2
                // Stroke Start (center of cap) = Visual Start + strokeWidth/2
                // Visual Length = seg.finalLength - spacing
                // Dash Value (center-to-center) = Visual Length - strokeWidth
                
                // Dash Value = seg.finalLength - spacing - strokeWidth
                dashVal = Math.max(0.1, seg.finalLength - spacing - strokeWidth);
                
                const startShift = (spacing / 2) + (strokeWidth / 2);
                dashOffset = -(currentOffset + startShift);
            }

            ring.setAttribute('stroke-dasharray', `${dashVal} ${circumference}`);
            ring.setAttribute('stroke-dashoffset', dashOffset);

            // Label Positioning
            // Based on the center of the allocated sector
            const midPoint = currentOffset + (seg.finalLength / 2);
            const angle = (midPoint / circumference) * 2 * Math.PI - (Math.PI / 2);

            // Adjust distance for 'savings' label to bring it closer
            const dist = seg.key === 'savings' ? baseLabelDistance - 9.5 : baseLabelDistance;
            const x = 50 + Math.cos(angle) * dist;
            const y = 50 + Math.sin(angle) * dist;

            container.style.left = `${x}%`;
            container.style.top = `${y}%`;
        }

        currentOffset += seg.finalLength;
    });

    const growthBadge = document.getElementById('growth-badge');
    if (growthBadge) {
        // Calculate net power: (Assets) - (Liabilities)
        const assets = (totals.savings || 0) + (totals.investment || 0) + (totals.emergency || 0);
        const liabilities = (totals.expenses || 0) + (totals.subscriptions || 0);
        const netPower = assets - liabilities;
        
        const goal = 50000;
        // Clamp to 0 if negative for visual progress
        const growth = Math.max(0, (netPower / goal * 100)).toFixed(1);
        growthBadge.innerHTML = `<span class="opacity-70 mr-1.5 text-[10px] font-black tracking-tight">Money Power Goal</span>${growth}%`;
    }
}