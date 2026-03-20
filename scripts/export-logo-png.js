#!/usr/bin/env node
/**
 * 将 assets/app-logo.svg 导出为透明背景 PNG
 * 运行: node scripts/export-logo-png.js
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const svgPath = path.join(__dirname, '../assets/app-logo.svg');
const pngPath = path.join(__dirname, '../assets/app-logo.png');

const svg = fs.readFileSync(svgPath, 'utf-8');
const resvg = new Resvg(svg);
const pngData = resvg.render();
const pngBuffer = pngData.asPng();

fs.writeFileSync(pngPath, pngBuffer);
console.log('✅ 已导出:', pngPath);
