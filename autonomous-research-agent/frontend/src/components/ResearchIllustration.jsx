import React from 'react'

export function ResearchIllustration({ className = '' }) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 540 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle drop shadows */}
          <filter id="softFloorGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <filter id="laptopShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="24" stdDeviation="16" floodColor="#1e3a8a" floodOpacity="0.08" />
          </filter>
          <filter id="screenGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#2563eb" floodOpacity="0.1" />
          </filter>
          <filter id="floatCardShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="8" dy="16" stdDeviation="12" floodColor="#1e3a8a" floodOpacity="0.12" />
          </filter>

          {/* Gradients */}
          <linearGradient id="laptopBodyGrad" x1="120" y1="230" x2="380" y2="350" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="bezelBlueGrad" x1="100" y1="90" x2="350" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="screenBgGrad" x1="110" y1="100" x2="340" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          <linearGradient id="leafGradDark" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>

          <linearGradient id="leafGradLight" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>

          <linearGradient id="leafGradBright" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#86EFAC" />
          </linearGradient>

          <linearGradient id="potGrad" x1="60" y1="280" x2="105" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* FLOOR SHADOW & AMBIENT GLOW                                    */}
        {/* ============================================================== */}
        <ellipse cx="250" cy="335" rx="190" ry="32" fill="#DBEAFE" opacity="0.6" filter="url(#softFloorGlow)" />
        <ellipse cx="240" cy="340" rx="130" ry="18" fill="#CBD5E1" opacity="0.4" filter="url(#softFloorGlow)" />

        {/* ============================================================== */}
        {/* POTTED PLANT (LEFT)                                            */}
        {/* ============================================================== */}
        <g id="plant-group">
          {/* Pot base shadow */}
          <ellipse cx="88" cy="342" rx="22" ry="6" fill="#94A3B8" opacity="0.25" />

          {/* Plant Leaves */}
          <g transform="translate(0, 0)">
            {/* Back tall leaf */}
            <path
              d="M88 285 C75 250 72 220 82 195 C90 220 95 250 88 285 Z"
              fill="url(#leafGradDark)"
            />
            {/* Left wide leaf */}
            <path
              d="M86 288 C60 268 40 252 30 240 C50 232 75 254 86 288 Z"
              fill="url(#leafGradLight)"
            />
            {/* Far right leaf */}
            <path
              d="M90 288 C110 268 128 255 140 244 C124 235 102 254 90 288 Z"
              fill="url(#leafGradDark)"
            />
            {/* Front left arching leaf */}
            <path
              d="M87 292 C68 276 52 270 42 278 C54 288 74 292 87 292 Z"
              fill="url(#leafGradBright)"
            />
            {/* Front right arching leaf */}
            <path
              d="M89 292 C108 276 122 270 132 278 C120 288 100 292 89 292 Z"
              fill="url(#leafGradLight)"
            />
            {/* Center upright leaf */}
            <path
              d="M88 286 C82 254 85 228 92 208 C97 230 96 258 88 286 Z"
              fill="url(#leafGradBright)"
            />
          </g>

          {/* Ceramic Pot */}
          <path
            d="M74 290 L102 290 L98 335 C98 338 78 338 78 335 Z"
            fill="url(#potGrad)"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          {/* Pot top rim */}
          <ellipse cx="88" cy="290" rx="14" ry="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <ellipse cx="88" cy="290" rx="11" ry="2.8" fill="#475569" opacity="0.2" />
        </g>

        {/* ============================================================== */}
        {/* ISOMETRIC LAPTOP                                               */}
        {/* ============================================================== */}
        <g id="laptop-group" filter="url(#laptopShadow)">
          {/* Laptop Base (Isometric Keyboard Deck) */}
          {/* Base bottom thickness */}
          <path
            d="M105 298 L240 358 C246 361 254 361 260 358 L395 304 C402 301 402 296 395 293 L260 238 C254 235 246 235 240 238 L105 293 C98 296 98 301 105 298 Z"
            fill="#CBD5E1"
          />
          {/* Base top surface */}
          <path
            d="M105 295 L240 355 C246 358 254 358 260 355 L395 301 C402 298 402 293 395 290 L260 235 C254 232 246 232 240 235 L105 290 C98 293 98 298 105 295 Z"
            fill="url(#laptopBodyGrad)"
            stroke="#DBEAFE"
            strokeWidth="1"
          />

          {/* Keyboard Well & Grid Lines */}
          <g opacity="0.7">
            <path
              d="M145 285 L244 326 C248 328 254 328 258 326 L355 288 C358 286 358 284 354 282 L258 244 C254 242 248 242 244 244 L145 281 C142 282 142 284 145 285 Z"
              fill="#F1F5F9"
              stroke="#CBD5E1"
              strokeWidth="0.8"
            />
            {/* Keyboard horizontal row lines */}
            <path d="M162 278 L248 312 M254 312 L338 280" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M178 272 L248 300 M254 300 L322 274" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M194 266 L248 288 M254 288 L306 268" stroke="#CBD5E1" strokeWidth="1.2" />
            {/* Trackpad */}
            <path
              d="M228 334 L246 342 C248 343 252 343 254 342 L274 334 C276 333 276 331 274 330 L254 323 C252 322 248 322 246 323 L228 330 C226 331 226 333 228 334 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="0.8"
            />
          </g>

          {/* Upright Screen */}
          <g id="screen-display" filter="url(#screenGlow)">
            {/* Outer Blue Bezel */}
            <path
              d="M102 238 L250 286 C255 288 260 286 262 282 L342 120 C344 116 340 112 335 110 L187 62 C182 60 177 62 175 66 L98 228 C96 233 97 236 102 238 Z"
              fill="url(#bezelBlueGrad)"
              stroke="#1D4ED8"
              strokeWidth="2"
            />

            {/* Inner White Display */}
            <path
              d="M110 232 L248 276 C251 277 254 276 256 273 L332 126 C334 123 331 120 328 119 L190 74 C187 73 184 74 182 77 L108 225 C106 228 107 231 110 232 Z"
              fill="url(#screenBgGrad)"
            />

            {/* Window Header Top Bar */}
            <path d="M178 84 L305 125" stroke="#E2E8F0" strokeWidth="0.9" />
            <circle cx="168" cy="80" r="2.2" fill="#93C5FD" />
            <circle cx="174" cy="82" r="2.2" fill="#BFDBFE" />
            <circle cx="180" cy="84" r="2.2" fill="#DBEAFE" />

            {/* ========================================================== */}
            {/* SCREEN CONTENT: SEARCH BAR & RESULTS                       */}
            {/* ========================================================== */}
            {/* 1. Large Top Search Bar */}
            <g id="screen-search-box">
              <path
                d="M136 146 L262 188 C265 189 268 188 270 185 L284 156 C286 153 284 150 281 149 L155 107 C152 106 149 107 147 110 L134 139 C132 142 133 145 136 146 Z"
                fill="#FFFFFF"
                stroke="#BFDBFE"
                strokeWidth="1.4"
              />

              {/* Magnifying Glass Icon */}
              <circle cx="152" cy="129" r="4" stroke="#94A3B8" strokeWidth="1.4" fill="none" />
              <line x1="155" y1="132" x2="158" y2="135" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />

              {/* Search text skeleton line */}
              <rect x="164" y="128" width="48" height="2.8" rx="1.4" fill="#CBD5E1" transform="rotate(18 164 128)" />

              {/* Blue "AI" Tag */}
              <path
                d="M236 152 L250 157 C252 158 253 157 254 155 L257 147 C258 145 257 144 255 143 L241 138 C239 137 238 138 237 140 L234 148 C233 150 234 151 236 152 Z"
                fill="#2563EB"
              />
              <text
                x="245"
                y="151"
                fill="#FFFFFF"
                fontSize="6.8"
                fontWeight="bold"
                fontFamily="system-ui, sans-serif"
                textAnchor="middle"
                transform="rotate(18 245 151)"
              >
                AI
              </text>

              {/* Blue Search Action Button */}
              <path
                d="M255 158 L269 163 C271 164 273 163 274 161 L278 153 C279 151 278 149 276 148 L262 143 C260 142 258 143 257 145 L253 153 C252 155 253 157 255 158 Z"
                fill="#1D4ED8"
              />
              <circle cx="265" cy="154" r="2.8" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
              <line x1="267" y1="156" x2="270" y2="159" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
            </g>

            {/* 2. Left Results Panel (Skeleton rows) */}
            <g id="screen-left-card">
              <path
                d="M136 198 L188 215 C190 216 193 215 194 213 L206 188 C207 186 206 184 204 183 L152 166 C150 165 147 166 146 168 L134 193 C133 195 134 197 136 198 Z"
                fill="#FFFFFF"
                stroke="#DBEAFE"
                strokeWidth="1.2"
              />
              <rect x="146" y="179" width="30" height="3" rx="1.5" fill="#93C5FD" transform="rotate(18 146 179)" />
              <rect x="143" y="188" width="36" height="2.4" rx="1.2" fill="#BFDBFE" transform="rotate(18 143 188)" />
              <rect x="140" y="196" width="26" height="2.4" rx="1.2" fill="#DBEAFE" transform="rotate(18 140 196)" />
            </g>

            {/* 3. Right Results Panel (Mountain & Trend Chart) */}
            <g id="screen-right-card">
              <path
                d="M204 220 L258 238 C260 239 263 238 264 236 L276 211 C277 209 276 207 274 206 L220 188 C218 187 215 188 214 190 L202 215 C201 217 202 219 204 220 Z"
                fill="#FFFFFF"
                stroke="#DBEAFE"
                strokeWidth="1.2"
              />
              {/* Blue mountain graphic */}
              <path
                d="M222 208 L232 202 L244 212 L238 216 L216 212 Z"
                fill="#60A5FA"
                opacity="0.85"
              />
              <path
                d="M232 202 L240 197 L250 208 L244 212 Z"
                fill="#2563EB"
              />
              {/* Trend chart line */}
              <path
                d="M214 214 L224 209 L236 211 L248 199 L258 203"
                stroke="#3B82F6"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="248" cy="199" r="1.8" fill="#2563EB" />
            </g>
          </g>

          {/* ============================================================== */}
          {/* FLOATING REPORT DOCUMENT (RIGHT OF SCREEN)                     */}
          {/* ============================================================== */}
          <g id="floating-doc" filter="url(#floatCardShadow)">
            <path
              d="M308 248 L354 264 C358 265 362 263 364 259 L382 204 C384 200 382 196 378 195 L332 179 C328 178 324 180 322 184 L304 239 C302 243 304 247 308 248 Z"
              fill="#FFFFFF"
              stroke="#DBEAFE"
              strokeWidth="1.4"
            />
            {/* Header pill */}
            <rect x="334" y="190" width="22" height="3" rx="1.5" fill="#3B82F6" transform="rotate(19 334 190)" />
            {/* Text lines */}
            <rect x="330" y="200" width="30" height="2" rx="1" fill="#94A3B8" transform="rotate(19 330 200)" />
            <rect x="326" y="209" width="32" height="2" rx="1" fill="#CBD5E1" transform="rotate(19 326 209)" />
            <rect x="322" y="218" width="26" height="2" rx="1" fill="#CBD5E1" transform="rotate(19 322 218)" />
            <rect x="318" y="227" width="34" height="2" rx="1" fill="#CBD5E1" transform="rotate(19 318 227)" />
            <rect x="314" y="236" width="18" height="2" rx="1" fill="#93C5FD" transform="rotate(19 314 236)" />
          </g>

          {/* ============================================================== */}
          {/* FLOATING 4-POINT BLUE SPARKLE STAR                             */}
          {/* ============================================================== */}
          <g id="sparkle-star" transform="translate(362, 106)">
            <circle cx="0" cy="0" r="14" fill="#60A5FA" opacity="0.3" filter="url(#softFloorGlow)" />
            <path
              d="M0 -15 C1 -4 4 -1 15 0 C4 1 1 4 0 15 C-1 4 -4 1 -15 0 C-4 -1 -1 -4 0 -15 Z"
              fill="#2563EB"
            />
            <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
          </g>

          {/* Micro sparkle near headline */}
          <g id="micro-sparkle" transform="translate(225, 48) scale(0.65)">
            <path
              d="M0 -12 C1 -3 3 -1 12 0 C3 1 1 3 0 12 C-1 3 -3 1 -12 0 C-3 -1 -1 -3 0 -12 Z"
              fill="#3B82F6"
              opacity="0.8"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}

export default ResearchIllustration
