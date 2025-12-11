// src/hooks/usePasswordRequirements.ts

import { useMemo } from 'react';

export const usePasswordRequirements = (password: string) => {
    const { requirements, metCount, isStrong } = useMemo(() => {
        // As regras refletem EXATAMENTE o esquema Zod
        const rules = [
            { regex: /.{6,}/, text: "Mínimo de 6 caracteres", key: 'min' },
            { regex: /[0-9]/, text: "Pelo menos um número (0-9)", key: 'number' },
            { regex: /[A-Z]/, text: "Pelo menos uma letra maiúscula (A-Z)", key: 'uppercase' },            
        ];

        const checks = rules.map(req => ({
            ...req,
            met: req.regex.test(password), // Testa se a regra foi cumprida
        }));
        
        const count = checks.filter(c => c.met).length;
        const isStrongCheck = count === rules.length;

        return {
            requirements: checks,
            metCount: count,
            isStrong: isStrongCheck,
        };
    }, [password]);

    // 2. Lógica para o texto da Força
    let strengthText = '';
    let strengthColor = 'bg-gray-400';
    let strengthWidth = '0%';
    
    if (password.length > 0) {
        if (isStrong) {
            strengthText = 'Forte! ✅';
            strengthColor = 'bg-green-600';
            strengthWidth = '100%';
        } else if (metCount >= 2) {
            strengthText = 'Média';
            strengthColor = 'bg-yellow-500';
            strengthWidth = '66%';
        } else {
            strengthText = 'Fraca';
            strengthColor = 'bg-red-600';
            strengthWidth = '33%';
        }
    }

    return {
        requirements,
        strength: { text: strengthText, color: strengthColor, width: strengthWidth },
    };
};