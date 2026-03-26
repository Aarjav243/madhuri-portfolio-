"use client";

import { useEffect } from "react";

export default function CustomCursor() {
    useEffect(() => {
        // Check if device supports hover (ignores mobile devices)
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const gsap = (window as any).gsap;
        if (!gsap) {
            console.warn("GSAP not loaded yet for custom cursor.");
            return;
        }

        // Magnetic & Snap Effect Selectors
        const interactiveElements = document.querySelectorAll(
            "a, button, .glass-card, .btn, .nav__hamburger, .section__title, .pub__title, .education__degree, .teaching__role, .research__name, .research__icon"
        );

        const onHoverEnter = (e: Event) => {
            const target = e.currentTarget as HTMLElement;
            const rect = target.getBoundingClientRect();

            // Magnetic Move
            const onMagneticMove = (mmE: MouseEvent) => {
                const mX = mmE.clientX - rect.left - rect.width / 2;
                const mY = mmE.clientY - rect.top - rect.height / 2;

                gsap.to(target, {
                    x: mX * 0.2,
                    y: mY * 0.2,
                    duration: 0.4,
                    ease: "power2.out"
                });
            };

            target.addEventListener("mousemove", onMagneticMove as any);
            (target as any)._magneticMove = onMagneticMove;
        };

        const onHoverLeave = (e: Event) => {
            const target = e.currentTarget as HTMLElement;
            gsap.to(target, { x: 0, y: 0, shadow: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });

            if ((target as any)._magneticMove) {
                target.removeEventListener("mousemove", (target as any)._magneticMove);
            }
        };

        interactiveElements.forEach((el) => {
            el.addEventListener("mouseenter", onHoverEnter);
            el.addEventListener("mouseleave", onHoverLeave);
        });

        return () => {
            interactiveElements.forEach((el) => {
                el.removeEventListener("mouseenter", onHoverEnter);
                el.removeEventListener("mouseleave", onHoverLeave);
            });
        };
    }, []);

    return null;
}

