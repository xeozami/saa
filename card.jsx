import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './CardDesigner.css';
import Icon from './icon/icon'; // Varsayılan olarak LabelDesigner'daki Icon bileşenini kullanıyoruz

export default function CardDesigner() {
    // Durum değişkenleri
    const [design, setDesign] = useState({
        text: '',
        font: 'Roboto',
        fontSize: 14,
        textColor: '#000000',
        backgroundColor: '#ffffff',
        icon: 'none',
        iconPosition: 'none',
        size: 'medium', // small: 40x70mm, medium: 50x90mm, large: 60x110mm
        cardboardType: 'standard', // standard, premium, recycled
        applicationMethod: 'hole', // hole, string, adhesive
        frameStyle: 'none', // none, single, double
        textAlignment: 'middle-center',
        extras: {
            cornerRadius: false,
            glossyFinish: false,
            reinforced: false
        },
        quantity: 1000
    });

    const [fontCategory, setFontCategory] = useState('All');
    const [iconCategory, setIconCategory] = useState('All');
    const [loading, setLoading] = useState(false);
    const [overlay, setOverlay] = useState({ show: false, message: '', onConfirm: null });
    const [scrollPosition, setScrollPosition] = useState(0);
    const [fontScrollPosition, setFontScrollPosition] = useState(0);

    const categorySliderRef = useRef(null);
    const fontCategorySliderRef = useRef(null);
    const cardRef = useRef(null);

    // Font kategorileri (LabelDesigner'dan alınmış)
    const fontCategories = useMemo(() => {
        const baseCategories = {
            "Sans Serif": [
                "Roboto", "Open Sans", "Montserrat", "Poppins", "Inter", "Lato",
                "Rubik", "Work Sans", "Nunito", "Source Sans 3", "Barlow", "Public Sans"
            ],
            "Serif": [
                "Playfair Display", "Merriweather", "Lora", "Crimson Pro", "Libre Baskerville",
                "EB Garamond", "Zilla Slab", "Cardo", "Bitter", "PT Serif", "Vollkorn", "Source Serif 4"
            ],
            "Handwriting": [
                "Caveat", "Dancing Script", "Patrick Hand", "Indie Flower", "Kalam",
                "Shadows Into Light", "Amatic SC", "Architects Daughter", "Gochi Hand",
                "Annie Use Your Telescope", "Coming Soon", "Nothing You Could Do"
            ],
            "Decorative": [
                "Bebas Neue", "Oswald", "Lobster", "Abril Fatface", "Bangers",
                "Alfa Slab One", "Shrikhand", "Fredericka the Great", "Black Han Sans",
                "Big Shoulders Display", "Passion One", "Rammetto One"
            ],
            "Modern": [
                "Futura", "Manrope", "Overpass", "Jost", "Sora", "Outfit",
                "Chivo", "Karla", "Archivo", "DM Sans", "Exo 2", "Cabin"
            ],
            "Vintage": [
                "Special Elite", "Old Standard TT", "Cinzel", "IM Fell English",
                "UnifrakturMaguntia", "Spectral", "Rye", "Almendra", "Pirata One",
                "Metal Mania", "Germania One", "Caesar Dressing"
            ],
            "Script": [
                "Great Vibes", "Sacramento", "Alex Brush", "Kaushan Script", "Parisienne",
                "Yellowtail", "Tangerine", "Clicker Script", "Allura", "Bad Script",
                "Lovers Quarrel", "Cedarville Cursive"
            ],
            "Monospace": [
                "Fira Code", "IBM Plex Mono", "Space Mono", "Inconsolata", "Roboto Mono",
                "Source Code Pro", "JetBrains Mono", "Courier Prime", "Overpass Mono",
                "Ubuntu Mono", "VT323", "Share Tech Mono"
            ]
        };
        const allFonts = [...new Set(Object.values(baseCategories).flat())];
        return { "All": allFonts, ...baseCategories };
    }, []);

    // İkon kategorileri (LabelDesigner'dan alınmış)
    const iconCategories = useMemo(() => {
        const categories = [
            { name: 'Letters', icon: 'a', icons: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] },
            { name: 'Numbers', icon: 'circle-number-1', icons: ['circle-number-0', 'circle-number-1', 'circle-number-2', 'circle-number-3', 'circle-number-4', 'circle-number-5', 'circle-number-6', 'circle-number-7', 'circle-number-8', 'circle-number-9', 'number-0', 'number-1', 'number-2', 'number-3', 'number-4', 'number-5', 'number-6', 'number-7', 'number-8', 'number-9', 'number-0-alt', 'number-1-alt', 'number-2-alt', 'number-3-alt', 'number-4-alt', 'number-5-alt', 'number-6-alt', 'number-7-alt', 'number-8-alt', 'number-9-alt'] },
            { name: 'Arrows', icon: 'arrow-right', icons: ['arrow-down', 'arrow-down-from-line', 'arrow-down-left', 'arrow-down-right', 'arrow-down-short-wide', 'arrow-down-to-bracket', 'arrow-down-to-line', 'arrow-down-wide-short', 'arrow-left', 'arrow-left-arrow-right', 'arrow-left-from-line', 'arrow-left-to-line', 'arrow-right', 'arrow-right-from-bracket', 'arrow-right-from-line', 'arrow-right-to-bracket', 'arrow-right-to-line', 'arrow-rotate-left', 'arrow-rotate-right', 'arrow-trend-down', 'arrow-trend-up', 'arrow-turn-down-left', 'arrow-turn-down-right', 'arrow-turn-left-down', 'arrow-turn-left-up', 'arrow-turn-right-down', 'arrow-turn-right-up', 'arrow-turn-up-left', 'arrow-turn-up-right', 'arrow-up', 'arrows-left-right', 'arrows-repeat', 'arrows-rotate-clockwise', 'arrows-rotate-counter-clockwise'] },
            { name: 'Shapes', icon: 'circle', icons: ['circle', 'circle-half', 'diamond', 'diamond-half', 'diamond-shape', 'hexagon', 'octagon', 'octagon-exclamation', 'square', 'square-checkmark', 'square-divide', 'square-equals', 'square-minus', 'square-plus', 'square-x', 'triangle', 'triangle-exclamation'] },
            { name: 'Text Formatting', icon: 'align-left', icons: ['align-bottom', 'align-center-horizontal', 'align-center-vertical', 'align-left', 'align-right', 'align-text-center', 'align-text-justify', 'align-text-right', 'align-top', 'bold', 'italic', 'underline', 'cursor', 'cursor-click', 'grid', 'grid-masonry', 'maximize', 'minimize', 'sidebar-left', 'sidebar-right'] },
            { name: 'Media', icon: 'microphone', icons: ['camera', 'camera-slash', 'desktop', 'film', 'headphones', 'image', 'images', 'laptop', 'microphone', 'microphone-slash', 'mobile', 'phone', 'phone-slash', 'tv', 'tv-retro', 'video', 'video-camera', 'video-camera-slash'] },
            { name: 'Weather', icon: 'cloud', icons: ['cloud', 'cloud-arrow-down', 'cloud-arrow-up', 'cloud-fog', 'cloud-lightning', 'cloud-rain', 'cloud-snow', 'moon', 'moon-cloud', 'moon-fog', 'rainbow', 'rainbow-cloud', 'sun', 'sun-cloud', 'sun-fog', 'wind'] },
            { name: 'Tools', icon: 'key', icons: ['book', 'book-open', 'bookmark', 'bookmark-plus', 'books', 'key', 'key-skeleton', 'keyboard', 'toolbox', 'wrench', 'pencil', 'pen-nib', 'palette', 'ruler', 'scissors'] },
            { name: 'Food & Drink', icon: 'utensils', icons: ['bottle', 'cake', 'cake-slice', 'citrus-slice', 'cocktail', 'cupcake', 'ice-cream', 'mug', 'pizza', 'soda', 'utensils', 'wine-glass'] },
            { name: 'Currency', icon: 'dollar', icons: ['british-pound', 'dollar', 'euro', 'yen', 'credit-card', 'money', 'receipt', 'wallet'] },
            { name: 'Emojis', icon: 'face-smile', icons: ['face-angry', 'face-cry', 'face-laugh', 'face-meh', 'face-melt', 'face-no-mouth', 'face-open-mouth', 'face-sad', 'face-smile', 'person', 'person-walking', 'person-wave', 'user', 'users'] },
            { name: 'Sports', icon: 'dice', icons: ['baseball', 'baseball-bat', 'basketball', 'dice', 'die-1', 'die-2', 'die-3', 'die-4', 'die-5', 'die-6', 'football', 'game-controller', 'hockey', 'joystick', 'soccer', 'tennis-ball'] },
            { name: 'Zodiac', icon: 'star', icons: ['aquarius', 'aries', 'cancer', 'capricorn', 'gemini', 'leo', 'libra', 'pisces', 'sagittarius', 'scorpio', 'taurus', 'virgo', 'star', 'star-half'] }
        ];
        const allIcons = [...new Set(categories.flatMap(cat => cat.icons))];
        return [{ name: 'All', icon: 'star', icons: allIcons }, ...categories];
    }, []);

    // Gösterilen ikonlar
    const displayedIcons = useMemo(() => {
        const selectedCategory = iconCategories.find(cat => cat.name === iconCategory);
        return selectedCategory ? selectedCategory.icons : [];
    }, [iconCategory, iconCategories]);

    // Boyut seçenekleri
    const sizeOptions = useMemo(() => [
        { name: 'Small', width: 40, height: 70, label: 'Small\n40x70mm', info: 'Best for small items' },
        { name: 'Medium', width: 50, height: 90, label: 'Medium\n50x90mm', info: 'Standard size' },
        { name: 'Large', width: 60, height: 110, label: 'Large\n60x110mm', info: 'Best for large items' }
    ], []);

    // Hizalama seçenekleri
    const alignmentOptions = useMemo(() => [
        { value: 'top-left', label: 'Top Left', preview: 'T' },
        { value: 'top-center', label: 'Top Center', preview: 'T' },
        { value: 'top-right', label: 'Top Right', preview: 'T' },
        { value: 'middle-left', label: 'Middle Left', preview: 'T' },
        { value: 'middle-center', label: 'Middle Center', preview: 'T' },
        { value: 'middle-right', label: 'Middle Right', preview: 'T' },
        { value: 'bottom-left', label: 'Bottom Left', preview: 'T' },
        { value: 'bottom-center', label: 'Bottom Center', preview: 'T' },
        { value: 'bottom-right', label: 'Bottom Right', preview: 'T' }
    ], []);

    // İkon pozisyonları
    const iconPositions = useMemo(() => [
        { value: 'none', label: 'No Icon', preview: 'Text' },
        { value: 'left', label: 'Left Icon', preview: '★ Text' },
        { value: 'both', label: 'Both Sides', preview: '★ Text ★' },
        { value: 'right', label: 'Right Icon', preview: 'Text ★' }
    ], []);

    // Renk paleti
    const colorPalette = useMemo(() => [
        "#000000", "#FFFFFF", "#FF0000", "#FF3333", "#FF6666", "#FF9999", "#FFCCCC",
        "#FF4500", "#FF5E1A", "#FF7733", "#FF914D", "#FFAA66", "#FFD700", "#FFDF33",
        "#FFE566", "#FFEB99", "#FFF1CC", "#008000", "#1A8C1A", "#33A133", "#4DB54D",
        "#66C966", "#0000FF", "#3333FF", "#6666FF", "#9999FF", "#CCCCFF", "#800080",
        "#8C1A8C", "#A133A1", "#B54DB5", "#C966C9", "#FF69B4", "#FF7ABC", "#FF8CC4",
        "#FF9ECC", "#FFB0D4", "#333333", "#4D4D4D", "#666666", "#808080", "#999999",
        "#8B4513", "#A0522D", "#B5651D", "#C97828", "#DB8B33", "#00CED1", "#1AD4D7",
        "#33DADD", "#4DE0E3", "#66E6E9", "#4169E1", "#5277E5", "#6385E9", "#7493ED",
        "#85A1F1", "#32CD32", "#43D143", "#54D554", "#65D965", "#76DD76", "#2F4F4F",
        "#3B5A5A", "#476565", "#537070", "#5F7B7B", "#FFB6C1", "#FFDBC1", "#FFFACD",
        "#E6E6FA", "#D3F9D8"
    ], []);

    // Kategori kaydırma
    const scrollCategories = useCallback((direction) => {
        const container = categorySliderRef.current;
        if (container) {
            const scrollAmount = 200;
            const newPosition = direction === 'left'
                ? scrollPosition - scrollAmount
                : scrollPosition + scrollAmount;
            container.scrollTo({ left: newPosition, behavior: 'smooth' });
            setScrollPosition(newPosition);
        }
    }, [scrollPosition]);

    const scrollFontCategories = useCallback((direction) => {
        const container = fontCategorySliderRef.current;
        if (container) {
            const scrollAmount = 200;
            const newPosition = direction === 'left'
                ? fontScrollPosition - scrollAmount
                : fontScrollPosition + scrollAmount;
            container.scrollTo({ left: newPosition, behavior: 'smooth' });
            setFontScrollPosition(newPosition);
        }
    }, [fontScrollPosition]);

    // Font boyutu aralığı
    const getFontSizeRange = useCallback(() => {
        let minSize, maxSize;
        if (design.size === 'small') {
            minSize = 8;
            maxSize = 36;
        } else if (design.size === 'medium') {
            minSize = 10;
            maxSize = 48;
        } else {
            minSize = 12;
            maxSize = 60;
        }
        return { min: minSize, max: maxSize };
    }, [design.size]);

    // Ölçek faktörü hesaplama
    const calculateScaleFactor = useCallback((width, height) => {
        const baseWidth = 300;
        const baseHeight = 400;
        let widthScale = baseWidth / 50;
        let heightScale = baseHeight / 90;
        if (width === 60 && height === 110) {
            widthScale *= 1.2;
            heightScale *= 1.2;
        } else if (width === 40 && height === 70) {
            widthScale *= 0.8;
            heightScale *= 0.8;
        }
        return { widthScale, heightScale };
    }, []);

    // Fiyat hesaplama
    const calculatePrice = useCallback(() => {
        if (!window.crd_ajax_obj || !window.crd_ajax_obj.settings) {
            console.error('Settings not found:', window.crd_ajax_obj);
            return { total: '0.00', perPiece: '0.00' };
        }

        const settings = window.crd_ajax_obj.settings;
        const safeNumber = (value) => {
            const num = Number(value);
            return isNaN(num) ? 0 : num;
        };

        let basePrice = 0;
        if (design.size === 'small') {
            basePrice = safeNumber(settings.price_small);
        } else if (design.size === 'medium') {
            basePrice = safeNumber(settings.price_medium);
        } else {
            basePrice = safeNumber(settings.price_large);
        }

        switch (design.cardboardType) {
            case 'premium':
                basePrice += safeNumber(settings.premium_cardboard_fee);
                break;
            case 'recycled':
                basePrice += safeNumber(settings.recycled_cardboard_fee);
                break;
            default:
                break;
        }

        if (design.applicationMethod === 'string') {
            basePrice += safeNumber(settings.string_attachment_fee);
        } else if (design.applicationMethod === 'adhesive') {
            basePrice += safeNumber(settings.adhesive_back_fee);
        }

        if (design.extras.cornerRadius) {
            basePrice += safeNumber(settings.corner_radius_fee);
        }
        if (design.extras.glossyFinish) {
            basePrice += safeNumber(settings.glossy_finish_fee);
        }
        if (design.extras.reinforced) {
            basePrice += safeNumber(settings.reinforced_fee);
        }

        const getDiscountRate = () => {
            const quantities = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000];
            let applicableDiscount = 0;
            for (let i = quantities.length - 1; i >= 0; i--) {
                if (design.quantity >= quantities[i]) {
                    const discountKey = `quantity_${quantities[i]}_discount`;
                    applicableDiscount = safeNumber(settings[discountKey]);
                    break;
                }
            }
            return applicableDiscount;
        };

        const discountRate = getDiscountRate();
        const discountMultiplier = (100 - discountRate) / 100;
        const finalPrice = basePrice * discountMultiplier;

        return {
            total: (design.quantity * finalPrice).toFixed(2),
            perPiece: finalPrice.toFixed(2),
            discountRate
        };
    }, [design]);

    // Hangtag görüntüsünü yakalama
    const captureCard = useCallback(async () => {
        try {
            await document.fonts.ready;
            const size = sizeOptions.find(s => s.name.toLowerCase() === design.size);
            const { widthScale, heightScale } = calculateScaleFactor(size.width, size.height);
            const captureWidth = Math.round(size.width * widthScale);
            const captureHeight = Math.round(size.height * heightScale);

            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                left: -9999px;
                top: -9999px;
                width: ${captureWidth}px;
                height: ${captureHeight}px;
                background-color: ${design.backgroundColor};
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                border-radius: ${design.extras.cornerRadius ? '8px' : '0'};
            `;

            const baseSpacing = Math.max(Math.min(size.width, size.height) * 0.08, 12);
            const config = {
                none: { padding: { v: size.height * 0.18, h: size.width * 0.18 } },
                single: { borderWidth: 1.5, outerPadding: baseSpacing, padding: { v: size.height * 0.15, h: size.width * 0.15 } },
                double: { borderWidth: 1.5, outerPadding: baseSpacing, innerPadding: baseSpacing * 2, padding: { v: size.height * 0.15, h: size.width * 0.15 } }
            };
            const currentConfig = config[design.frameStyle];

            const cardBody = document.createElement('div');
            cardBody.style.cssText = `
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
            `;
            container.appendChild(cardBody);

            if (design.frameStyle === 'single' || design.frameStyle === 'double') {
                const outerFrame = document.createElement('div');
                outerFrame.style.cssText = `
                    position: absolute;
                    top: ${currentConfig.outerPadding}px;
                    left: ${currentConfig.outerPadding}px;
                    right: ${currentConfig.outerPadding}px;
                    bottom: ${currentConfig.outerPadding}px;
                    border: ${currentConfig.borderWidth}px solid ${design.textColor};
                    box-sizing: border-box;
                `;
                cardBody.appendChild(outerFrame);

                if (design.frameStyle === 'double') {
                    const innerFrame = document.createElement('div');
                    innerFrame.style.cssText = `
                        position: absolute;
                        top: ${currentConfig.innerPadding}px;
                        left: ${currentConfig.innerPadding}px;
                        right: ${currentConfig.innerPadding}px;
                        bottom: ${currentConfig.innerPadding}px;
                        border: ${currentConfig.borderWidth}px solid ${design.textColor};
                        box-sizing: border-box;
                    `;
                    cardBody.appendChild(innerFrame);
                }
            }

            const contentWrapper = document.createElement('div');
            const [vertical, horizontal] = design.textAlignment.split('-');
            const alignmentStyles = {
                top: 'flex-start', middle: 'center', bottom: 'flex-end',
                left: 'flex-start', center: 'center', right: 'flex-end'
            };
            const contentPadding = design.frameStyle === 'double'
                ? currentConfig.innerPadding + currentConfig.borderWidth * 2
                : design.frameStyle === 'single'
                    ? currentConfig.outerPadding + currentConfig.borderWidth * 2
                    : 0;

            contentWrapper.style.cssText = `
                position: absolute;
                top: ${contentPadding}px;
                left: ${contentPadding}px;
                right: ${contentPadding}px;
                bottom: ${contentPadding}px;
                display: flex;
                align-items: ${alignmentStyles[vertical]};
                justify-content: ${alignmentStyles[horizontal]};
                padding: ${currentConfig.padding.v}px ${currentConfig.padding.h}px;
                box-sizing: border-box;
                z-index: 1;
            `;

            const textContainer = document.createElement('div');
            textContainer.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: ${alignmentStyles[horizontal]};
                width: 100%;
                color: ${design.textColor};
                font-family: '${design.font}', sans-serif;
                font-size: ${design.fontSize}px;
                line-height: 1.2;
                max-width: 100%;
                word-break: break-word;
                overflow-wrap: break-word;
                white-space: normal;
            `;

            const iconWidth = design.icon !== 'none' ? (design.iconPosition === 'both' ? design.fontSize * 1.5 : design.fontSize * 0.75) : 0;
            const iconGap = design.icon !== 'none' ? Math.round(design.fontSize * 0.3) : 0;
            const totalIconSpace = iconWidth + (iconGap * (design.iconPosition === 'both' ? 2 : 1));

            const contentInner = document.createElement('div');
            contentInner.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: ${iconGap}px;
                max-width: calc(100% - ${totalIconSpace}px);
                flex-wrap: wrap;
                word-break: break-word;
                overflow-wrap: break-word;
                white-space: normal;
                padding: 0 4px;
            `;

            const createIcon = async (iconName) => {
                const iconDiv = document.createElement('div');
                iconDiv.style.cssText = `
                    width: ${design.fontSize * 0.75}px;
                    height: ${design.fontSize * 0.75}px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: ${design.textColor};
                    flex-shrink: 0;
                `;
                const svg = await fetch('assets/sprite.svg').then(res => res.text());
                const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
                const symbol = doc.querySelector(`#${iconName}`);
                iconDiv.innerHTML = symbol ? `<svg viewBox="${symbol.getAttribute('viewBox')}">${symbol.innerHTML}</svg>` : '';
                return iconDiv;
            };

            if (design.icon !== 'none' && design.iconPosition !== 'none') {
                if (design.iconPosition === 'left' || design.iconPosition === 'both') {
                    const iconElement = await createIcon(design.icon);
                    contentInner.appendChild(iconElement);
                }

                const textSpan = document.createElement('span');
                textSpan.style.cssText = `
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 1.2;
                    text-align: center;
                    white-space: normal;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    hyphens: auto;
                    transform: translateY(0);
                    max-width: 100%;
                    min-width: 0;
                    flex: 1;
                `;
                textSpan.textContent = design.text || 'Preview';
                contentInner.appendChild(textSpan);

                if (design.iconPosition === 'right' || design.iconPosition === 'both') {
                    const iconElement = await createIcon(design.icon);
                    contentInner.appendChild(iconElement);
                }
            } else {
                const textSpan = document.createElement('span');
                textSpan.style.cssText = `
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 1.2;
                    text-align: center;
                    white-space: normal;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    hyphens: auto;
                    transform: translateY(0);
                    max-width: 100%;
                    min-width: 0;
                    flex: 1;
                `;
                textSpan.textContent = design.text || 'Preview';
                contentInner.appendChild(textSpan);
            }

            textContainer.appendChild(contentInner);
            contentWrapper.appendChild(textContainer);
            cardBody.appendChild(contentWrapper);

            if (design.applicationMethod === 'hole') {
                const hole = document.createElement('div');
                hole.style.cssText = `
                    position: absolute;
                    top: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 5px;
                    height: 5px;
                    background-color: #000;
                    border-radius: 50%;
                `;
                cardBody.appendChild(hole);
            } else if (design.applicationMethod === 'string') {
                const string = document.createElement('div');
                string.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2px;
                    height: 10px;
                    background-color: #555;
                `;
                cardBody.appendChild(string);
            }

            document.body.appendChild(container);
            await new Promise(res => setTimeout(res, 100));

            const canvas = await html2canvas(container, {
                scale: 4,
                backgroundColor: design.backgroundColor,
                width: captureWidth,
                height: captureHeight,
                imageRendering: 'pixelated'
            });

            document.body.removeChild(container);
            return canvas.toDataURL('image/png', 1.0);
        } catch (e) {
            console.error('captureCard error:', e);
            throw e;
        }
    }, [design, sizeOptions, calculateScaleFactor]);

    // Sepete ekleme
    const addToCart = useCallback(async () => {
        if (loading || !design.text.trim()) {
            alert('Please enter some text for your hangtag');
            return;
        }
        setLoading(true);
        try {
            const cardImage = await captureCard();
            if (!cardImage) {
                throw new Error('Failed to create hangtag image');
            }

            const priceInfo = calculatePrice();
            const designData = {
                ...design,
                imageData: cardImage.split(',')[1],
                created_at: new Date().toISOString(),
                created_by: 'cardgo',
                calculated_price: {
                    per_piece: parseFloat(priceInfo.perPiece),
                    total: parseFloat(priceInfo.total)
                }
            };

            const formData = new FormData();
            formData.append('action', 'add_to_cart_custom_card');
            formData.append('product_id', document.getElementById('card-designer-root').dataset.productId);
            formData.append('quantity', design.quantity);
            formData.append('card_design', JSON.stringify(designData));
            formData.append('custom_price', priceInfo.perPiece);
            formData.append('security', window.crd_ajax_obj.nonce);

            const response = await axios({
                method: 'POST',
                url: window.crd_ajax_obj.ajax_url,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                window.location.href = response.data.data.cart_url;
            } else {
                throw new Error(response.data.data?.message || 'Error adding to cart');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            alert(error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [loading, design, captureCard, calculatePrice]);

    // Çerçeve ve padding hesaplama
    const calculateFrameOffsets = useCallback(() => {
        const size = sizeOptions.find(s => s.name.toLowerCase() === design.size);
        const verticalPadding = Math.max(2, size.height * 0.02);
        const horizontalPadding = Math.max(4, size.width * 0.03);
        const verticalFrameOffset = design.frameStyle === 'double'
            ? Math.max(12, size.height * 0.08)
            : design.frameStyle === 'single'
                ? Math.max(12, size.height * 0.08)
                : verticalPadding;
        const horizontalFrameOffset = design.frameStyle === 'double'
            ? Math.max(12, size.width * 0.08)
            : design.frameStyle === 'single'
                ? Math.max(12, size.width * 0.08)
                : horizontalPadding;
        return { verticalPadding, horizontalPadding, verticalFrameOffset, horizontalFrameOffset };
    }, [design.frameStyle, design.size, sizeOptions]);

    // Önizleme içeriği oluşturma
    const renderCardContent = useCallback(() => {
        const content = design.text || 'Enter hangtag text';
        const { verticalPadding, horizontalPadding } = calculateFrameOffsets();
        const size = sizeOptions.find(s => s.name.toLowerCase() === design.size);
        const containerClassName = `card-container ${design.frameStyle !== 'none' ? `with-${design.frameStyle}-frame` : ''}`;
        const textureClass = design.cardboardType === 'recycled' ? 'recycled-texture' : design.cardboardType === 'premium' ? 'premium-texture' : 'standard-texture';
        const availableWidth = `calc(100% - ${horizontalPadding * 2}px)`;
        const availableHeight = `calc(100% - ${verticalPadding * 2}px)`;

        const iconEl = design.icon !== 'none' ? (
            <span
                className="icon"
                style={{
                    width: `${Math.round(design.fontSize)}px`,
                    height: `${Math.round(design.fontSize)}px`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    verticalAlign: 'middle'
                }}
            >
                <Icon name={design.icon} color={design.textColor} />
            </span>
        ) : null;

        return (
            <div className={containerClassName}>
                {design.frameStyle !== 'none' && (
                    <div className="outer-frame" style={{ borderColor: design.textColor }} />
                )}
                {design.frameStyle === 'double' && (
                    <div className="inner-frame" style={{ borderColor: design.textColor }} />
                )}
                <div
                    className={`card-content-wrapper ${design.frameStyle !== 'none' ? `${design.frameStyle}-frame` : ''} ${textureClass}`}
                    style={{
                        background: design.backgroundColor,
                        color: design.textColor,
                        fontFamily: design.font,
                        width: '100%',
                        height: '100%',
                        boxSizing: 'border-box',
                        borderRadius: design.extras.cornerRadius ? '8px' : '0'
                    }}
                >
                    <div
                        className={`card-text-display align-${design.textAlignment}`}
                        style={{
                            fontSize: `${Math.round(design.fontSize)}px`,
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            padding: design.frameStyle === 'double'
                                ? `${Math.max(8, size.height * 0.08)}px ${Math.max(12, size.width * 0.08)}px`
                                : design.frameStyle === 'single'
                                    ? `${Math.max(3, size.height * 0.02)}px ${Math.max(5, size.width * 0.03)}px`
                                    : `${Math.max(10, size.height * 0.09)}px ${Math.max(12, size.width * 0.08)}px`,
                            margin: '0 !important',
                            lineHeight: 1,
                            boxSizing: 'border-box',
                            width: '100%',
                            height: '100%',
                            alignItems: design.textAlignment.startsWith('middle') ? 'center' : design.textAlignment.startsWith('top') ? 'flex-start' : 'flex-end',
                            justifyContent: design.textAlignment.endsWith('center') ? 'center' : design.textAlignment.endsWith('left') ? 'flex-start' : 'flex-end'
                        }}
                    >
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: `${Math.max(2, Math.round(design.fontSize * 0.2))}px`,
                                textAlign: 'center',
                                maxWidth: availableWidth,
                                maxHeight: availableHeight,
                                overflow: 'hidden',
                                whiteSpace: 'normal',
                                lineHeight: 1
                            }}
                        >
                            {(design.iconPosition === 'left' || design.iconPosition === 'both') && iconEl}
                            <span
                                className="card-content"
                                style={{
                                    display: 'inline-block',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: 'center',
                                    whiteSpace: 'normal',
                                    lineHeight: 1
                                }}
                            >
                                {content}
                            </span>
                            {(design.iconPosition === 'right' || design.iconPosition === 'both') && iconEl}
                        </span>
                    </div>
                </div>
                <div className="size-indicator">
                    <div className="width-indicator">{`${size.width}mm`}</div>
                    <div className="height-indicator">{`${size.height}mm`}</div>
                    <div className="dimension-line width-line" />
                    <div className="dimension-line height-line" />
                </div>
                {design.applicationMethod === 'hole' && (
                    <div className="punch-hole" style={{
                        position: 'absolute',
                        top: '5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '5px',
                        height: '5px',
                        backgroundColor: '#000',
                        borderRadius: '50%'
                    }} />
                )}
                {design.applicationMethod === 'string' && (
                    <div className="string-attachment" style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '2px',
                        height: '10px',
                        backgroundColor: '#555'
                    }} />
                )}
            </div>
        );
    }, [design, sizeOptions, calculateFrameOffsets]);

    // Efektler
    useEffect(() => {
        if (design.iconPosition === 'none') {
            setDesign(prev => ({ ...prev, icon: 'none' }));
        }
    }, [design.iconPosition]);

    useEffect(() => {
        if (design.icon !== 'none' && design.iconPosition === 'none') {
            setDesign(prev => ({ ...prev, iconPosition: 'left' }));
        }
    }, [design.icon, design.iconPosition]);

    useEffect(() => {
        if (cardRef.current) {
            const wrapper = cardRef.current.querySelector('.card-content-wrapper');
            if (wrapper) {
                wrapper.style.background = design.backgroundColor;
            }
        }
    }, [design.backgroundColor]);

    // Fiyatlar
    const prices = useMemo(() => calculatePrice(), [calculatePrice]);

    // Renk kontrastı hesaplama
    const calculateContrastRatio = (color1, color2) => {
        const hexToRgb = (hex) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
                : { r: 0, g: 0, b: 0 };
        };

        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);

        const rgbToXyz = (r, g, b) => {
            r = r / 255; g = g / 255; b = b / 255;
            r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
            g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
            b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
            r = r * 100; g = g * 100; b = b * 100;
            const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
            const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
            const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
            return [x, y, z];
        };

        const xyzToLab = (x, y, z) => {
            x = x / 95.047; y = y / 100; z = z / 108.883;
            x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
            y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
            z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);
            const l = (116 * y) - 16;
            const a = 500 * (x - y);
            const b = 200 * (y - z);
            return [l, a, b];
        };

        const [x1, y1, z1] = rgbToXyz(rgb1.r, rgb1.g, rgb1.b);
        const [x2, y2, z2] = rgbToXyz(rgb2.r, rgb2.g, rgb2.b);
        const [l1, a1, b1] = xyzToLab(x1, y1, z1);
        const [l2, a2, b2] = xyzToLab(x2, y2, z2);

        const deltaE = Math.sqrt(Math.pow(l2 - l1, 2) + Math.pow(a2 - a1, 2) + Math.pow(b2 - b1, 2));
        const getBrightness = (rgb) => (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        const brightness1 = getBrightness(rgb1);
        const brightness2 = getBrightness(rgb2);
        const brightnessDiff = Math.abs(brightness1 - brightness2);

        return {
            deltaE,
            brightnessDiff,
            isSimilar: deltaE < 30,
            isLowContrast: brightnessDiff < 50,
            needsWarning: deltaE < 30 && brightnessDiff < 50
        };
    };

    const checkColors = (newTextColor, newBgColor, setColorCallback, colorToSet) => {
        if (newTextColor === newBgColor) {
            setOverlay({
                show: true,
                message: 'Text color and background color cannot be the same!',
                onConfirm: null
            });
            return false;
        }

        const contrast = calculateContrastRatio(newTextColor, newBgColor);
        if (contrast.needsWarning) {
            setOverlay({
                show: true,
                message: 'Warning: The selected colors are too similar and may be hard to read. Do you want to proceed anyway?',
                onConfirm: () => setColorCallback({ ...design, textColor: newTextColor, backgroundColor: newBgColor })
            });
            return false;
        }
        return true;
    };

    return (
        <div className="card-designer-wrapper">
            <div className="designer-container">
                <div className="designer-controls">
                    <div className="control-group">
                        <div className="group-title">
                            Hangtag Size
                            <span className="help-icon">?
                                <span className="tooltip">Select the dimensions of your hangtag. Standard sizes are optimized for different product types.</span>
                            </span>
                        </div>
                        <div className="size-options">
                            {sizeOptions.map(size => (
                                <div
                                    key={size.name}
                                    className={`size-option ${design.size === size.name.toLowerCase() ? 'selected' : ''}`}
                                    onClick={() => setDesign(prev => ({ ...prev, size: size.name.toLowerCase() }))}
                                >
                                    <div className="size-preview">
                                        <div className="size-box" style={{ width: `${size.width * 0.8}px`, height: `${size.height * 0.8}px` }} />
                                    </div>
                                    <div className="size-details">
                                        <div className="size-name">{size.name}</div>
                                        <div className="size-dimensions">{`${size.width}x${size.height}mm`}</div>
                                        <div className="size-info">{size.info}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Hangtag Text
                            <span className="help-icon">?
                                <span className="tooltip">Enter the text for your hangtag. Adjust font size and style to match your design.</span>
                            </span>
                        </div>
                        <div className="text-control-wrapper">
                            <input
                                type="text"
                                value={design.text}
                                onChange={e => setDesign(prev => ({ ...prev, text: e.target.value }))}
                                className="card-text-input"
                                placeholder="Enter hangtag text"
                                maxLength={70}
                            />
                            <div className="font-size-control">
                                <label>Font Size: {Math.round(design.fontSize)}px</label>
                                <input
                                    type="range"
                                    min={getFontSizeRange().min}
                                    max={getFontSizeRange().max}
                                    value={design.fontSize}
                                    onChange={e => setDesign(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                                    step="1"
                                    className="range-slider"
                                />
                            </div>
                            <div className="control-group">
                                <div className="group-title">
                                    Text Alignment
                                    <span className="help-icon">?
                                        <span className="tooltip">Control how your text is positioned on the hangtag.</span>
                                    </span>
                                </div>
                                <div className="text-alignment-grid">
                                    {alignmentOptions.map(align => (
                                        <button
                                            key={align.value}
                                            className={`alignment-button ${design.textAlignment === align.value ? 'selected' : ''}`}
                                            onClick={() => setDesign(prev => ({ ...prev, textAlignment: align.value }))}
                                        >
                                            <div className="alignment-preview">
                                                <div className={`alignment-bar ${align.value}`}>
                                                    <span className="alignment-text">{align.preview}</span>
                                                </div>
                                            </div>
                                            <span className="alignment-label">{align.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Font Style
                            <span className="help-icon">?
                                <span className="tooltip">Choose from a variety of fonts to customize your hangtag's appearance.</span>
                            </span>
                        </div>
                        <div className="font-category-section">
                            <button
                                className="scroll-button left"
                                onClick={() => scrollFontCategories('left')}
                                disabled={fontScrollPosition <= 0}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <div className="font-category-slider" ref={fontCategorySliderRef}>
                                {Object.entries(fontCategories).map(([category, fonts]) => (
                                    <button
                                        key={category}
                                        className={`font-category-button ${fontCategory === category ? 'active' : ''}`}
                                        onClick={() => setFontCategory(category)}
                                    >
                                        <span className="font-preview-text" style={{ fontFamily: fonts[0] }}>Aa</span>
                                        <span className="font-category-name">{category}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                className="scroll-button right"
                                onClick={() => scrollFontCategories('right')}
                                disabled={fontScrollPosition >= (fontCategorySliderRef.current?.scrollWidth - fontCategorySliderRef.current?.clientWidth)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                        <div className="font-options-grid">
                            {fontCategories[fontCategory].map(fontName => (
                                <button
                                    key={fontName}
                                    className={`font-option ${design.font === fontName ? 'selected' : ''}`}
                                    style={{ fontFamily: fontName }}
                                    onClick={() => setDesign(prev => ({ ...prev, font: fontName }))}
                                >
                                    <span className="font-preview">Aa</span>
                                    <span className="font-name">{fontName}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Icon & Position
                            <span className="help-icon">?
                                <span className="tooltip">Add decorative icons to enhance your hangtag design.</span>
                            </span>
                        </div>
                        <div className="icon-position-options">
                            {iconPositions.map(pos => (
                                <button
                                    key={pos.value}
                                    className={`position-button ${design.iconPosition === pos.value ? 'selected' : ''}`}
                                    onClick={() => setDesign(prev => ({ ...prev, iconPosition: pos.value }))}
                                >
                                    <div className="position-preview">
                                        <div className="preview-frame">
                                            <span className="preview-text">{pos.preview}</span>
                                        </div>
                                    </div>
                                    <span className="position-label">{pos.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="icon-category-section">
                            <button
                                className="scroll-button left"
                                onClick={() => scrollCategories('left')}
                                disabled={scrollPosition <= 0}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <div className="icon-category-slider" ref={categorySliderRef}>
                                {iconCategories.map(category => (
                                    <button
                                        key={category.name}
                                        className={`icon-category-button ${iconCategory === category.name ? 'active' : ''}`}
                                        onClick={() => setIconCategory(category.name)}
                                    >
                                        <span className="category-icon">
                                            <Icon name={category.icon} color="#000000" />
                                        </span>
                                        <span className="category-name">{category.name}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                className="scroll-button right"
                                onClick={() => scrollCategories('right')}
                                disabled={scrollPosition >= (categorySliderRef.current?.scrollWidth - categorySliderRef.current?.clientWidth)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                        <div className="icon-options-grid">
                            {displayedIcons.map((iconName) => (
                                <button
                                    key={iconName}
                                    className={`icon-option ${design.icon === iconName ? 'selected' : ''}`}
                                    onClick={() => setDesign(prev => ({ ...prev, icon: iconName }))}
                                >
                                    <span className="icon-preview">
                                        <Icon name={iconName} color={design.textColor} size={24} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Frame Style
                            <span className="help-icon">?
                                <span className="tooltip">Add decorative frames around your text.</span>
                            </span>
                        </div>
                        <div className="frame-style-buttons">
                            {['none', 'single', 'double'].map(style => (
                                <button
                                    key={style}
                                    className={`frame-button ${design.frameStyle === style ? 'selected' : ''}`}
                                    onClick={() => setDesign(prev => ({ ...prev, frameStyle: style }))}
                                >
                                    <div className={`frame-preview ${style}-frame`}>
                                        <div className="preview-content"></div>
                                    </div>
                                    <span>{style === 'none' ? 'No Frame' : `${style.charAt(0).toUpperCase() + style.slice(1)} Frame`}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Colors
                            <span className="help-icon">?
                                <span className="tooltip">Select background and text colors for your hangtag.</span>
                            </span>
                        </div>
                        <div className="color-options-wrapper">
                            <div className="color-section">
                                <label>Text Color</label>
                                <div className="color-section-wrapper">
                                    <div className="color-palette">
                                        {colorPalette.map(color => (
                                            <button
                                                key={`text-${color}`}
                                                className={`color-swatch ${design.textColor === color ? 'selected' : ''}`}
                                                style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #E5E7EB' : 'none' }}
                                                onClick={() => {
                                                    if (checkColors(color, design.backgroundColor, (newDesign) => setDesign(newDesign), { ...design, textColor: color })) {
                                                        setDesign(prev => ({ ...prev, textColor: color }));
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="color-section">
                                <label>Background Color</label>
                                <div className="color-section-wrapper">
                                    <div className="color-palette">
                                        {colorPalette.map(color => (
                                            <button
                                                key={`bg-${color}`}
                                                className={`color-swatch ${design.backgroundColor === color ? 'selected' : ''}`}
                                                style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #E5E7EB' : 'none' }}
                                                onClick={() => {
                                                    if (checkColors(design.textColor, color, (newDesign) => setDesign(newDesign), { ...design, backgroundColor: color })) {
                                                        setDesign(prev => ({ ...prev, backgroundColor: color }));
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Material
                            <span className="help-icon">?
                                <span className="tooltip">Choose the material for your hangtag.</span>
                            </span>
                        </div>
                        <div className="material-options">
                            {[
                                { value: 'standard', title: 'Standard Cardboard', desc: 'Cost-effective option' },
                                { value: 'premium', title: 'Premium Cardboard', desc: 'Luxury finish' },
                                { value: 'recycled', title: 'Recycled Cardboard', desc: 'Eco-friendly' }
                            ].map(material => (
                                <button
                                    key={material.value}
                                    className={`material-button ${design.cardboardType === material.value ? 'selected' : ''}`}
                                    onClick={() => setDesign(prev => ({ ...prev, cardboardType: material.value }))}
                                >
                                    <div className="material-icon"></div>
                                    <div className="material-info">
                                        <span className="material-title">{material.title}</span>
                                        <span className="material-desc">{material.desc}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Application Method
                            <span className="help-icon">?
                                <span className="tooltip">Choose how the hangtag will be attached.</span>
                            </span>
                        </div>
                        <div className="application-options">
                            {[
                                { value: 'hole', title: 'Hole Punched', desc: 'Traditional method', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="2" fill="currentColor" /></svg> },
                                { value: 'string', title: 'String Attached', desc: 'Decorative option', icon: <svg viewBox="0 0 24 24"><path d="M12 2v4" stroke="currentColor" strokeWidth="2" /></svg> },
                                { value: 'adhesive', title: 'Adhesive Back', desc: 'Easy application', icon: <svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" fill="currentColor" /></svg> }
                            ].map(method => (
                                <button
                                    key={method.value}
                                    className={`application-button ${design.applicationMethod === method.value ? 'selected' : ''}`}
                                    onClick={() => setDesign(prev => ({ ...prev, applicationMethod: method.value }))}
                                >
                                    <div className="method-icon">{method.icon}</div>
                                    <div className="application-info">
                                        <span className="application-title">{method.title}</span>
                                        <span className="application-desc">{method.desc}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="group-title">
                            Extra Features
                            <span className="help-icon">?
                                <span className="tooltip">Additional options to enhance your hangtag.</span>
                            </span>
                        </div>
                        <div className="extras-options">
                            <button
                                className={`extra-option-button corner-radius ${design.extras.cornerRadius ? 'selected' : ''}`}
                                onClick={() => setDesign(prev => ({ ...prev, extras: { ...prev.extras, cornerRadius: !prev.extras.cornerRadius } }))}
                            >
                                <div className="method-icon">
                                    <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" /></svg>
                                </div>
                                <div className="extra-info">
                                    <span className="extra-title">Rounded Corners</span>
                                    <span className="extra-desc">Smooth edges</span>
                                </div>
                            </button>
                            <button
                                className={`extra-option-button glossy-finish ${design.extras.glossyFinish ? 'selected' : ''}`}
                                onClick={() => setDesign(prev => ({ ...prev, extras: { ...prev.extras, glossyFinish: !prev.extras.glossyFinish } }))}
                            >
                                <div className="method-icon">
                                    <svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z" fill="none" stroke="currentColor" /><path d="M6 6l12 12" stroke="currentColor" /></svg>
                                </div>
                                <div className="extra-info">
                                    <span className="extra-title">Glossy Finish</span>
                                    <span className="extra-desc">Shiny coating</span>
                                </div>
                            </button>
                            <button
                                className={`extra-option-button reinforced ${design.extras.reinforced ? 'selected' : ''}`}
                                onClick={() => setDesign(prev => ({ ...prev, extras: { ...prev.extras, reinforced: !prev.extras.reinforced } }))}
                            >
                                <div className="method-icon">
                                    <svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z" fill="none" stroke="currentColor" /><path d="M9 9h6v6H9z" stroke="currentColor" /></svg>
                                </div>
                                <div className="extra-info">
                                    <span className="extra-title">Reinforced</span>
                                    <span className="extra-desc">Extra durability</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="designer-canvas" style={{ height: 'auto', minHeight: '600px' }}>
                    <div className="preview-header">
                        <div className="dimensions">
                            <span className="actual-size">{`${sizeOptions.find(s => s.name.toLowerCase() === design.size).width}x${sizeOptions.find(s => s.name.toLowerCase() === design.size).height}mm`}</span>
                        </div>
                    </div>
                    <div className="canvas-frame">
                        <div
                            ref={cardRef}
                            className="card-preview"
                            style={{
                                width: `${sizeOptions.find(s => s.name.toLowerCase() === design.size).width * calculateScaleFactor(sizeOptions.find(s => s.name.toLowerCase() === design.size).width, sizeOptions.find(s => s.name.toLowerCase() === design.size).height).widthScale}px`,
                                height: `${sizeOptions.find(s => s.name.toLowerCase() === design.size).height * calculateScaleFactor(sizeOptions.find(s => s.name.toLowerCase() === design.size).width, sizeOptions.find(s => s.name.toLowerCase() === design.size).height).heightScale}px`
                            }}
                        >
                            {renderCardContent()}
                        </div>
                    </div>
                    <div className="order-section">
                        <div className="quantity-selector">
                            <label htmlFor="quantity">Quantity</label>
                            <select
                                id="quantity"
                                value={design.quantity}
                                onChange={e => setDesign(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                disabled={loading}
                            >
                                {[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000].map(q => (
                                    <option key={q} value={q}>{q} pieces</option>
                                ))}
                            </select>
                        </div>
                        <div className="price-info">
                            <div className="total-price">
                                <span>Total Price:</span>
                                <span className="amount">${prices.total}</span>
                            </div>
                            <div className="price-per-piece">${prices.perPiece} per piece</div>
                        </div>
                        <button
                            className={`add-to-cart-button ${loading ? 'loading' : ''}`}
                            onClick={addToCart}
                            disabled={loading || !design.text.trim()}
                        >
                            {loading ? 'Adding to Cart...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
            {overlay.show && (
                <div className="overlay">
                    <div className="overlay-content">
                        <p>{overlay.message}</p>
                        <div className="overlay-buttons">
                            {overlay.onConfirm ? (
                                <>
                                    <button
                                        className="overlay-button overlay-button-cancel"
                                        onClick={() => setOverlay({ show: false, message: '', onConfirm: null })}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="overlay-button overlay-button-confirm"
                                        onClick={() => {
                                            overlay.onConfirm();
                                            setOverlay({ show: false, message: '', onConfirm: null });
                                        }}
                                    >
                                        Confirm Anyway
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="overlay-button"
                                    onClick={() => setOverlay({ show: false, message: '', onConfirm: null })}
                                >
                                    OK
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
