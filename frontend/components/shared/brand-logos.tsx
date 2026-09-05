"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { AIModel, Company, ModelProvider, Provider } from "@/types/api";

export interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  name?: string;
  size?: number | string;
  className?: string;
}

// 1. Claude (Official Anthropic Claude Sunburst)
export function ClaudeLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("shrink-0 text-[#D97757]", className)}
      aria-label="Claude"
      {...props}
    >
      <path
        d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  );
}

// 2. Anthropic (Official Geometric Monogram)
export function AnthropicLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("shrink-0 text-[#D97757]", className)}
      aria-label="Anthropic"
      {...props}
    >
      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
    </svg>
  );
}

// 3. OpenAI (Official Spiral Vortex)
export function OpenAILogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("shrink-0 text-[#10A37F]", className)}
      aria-label="OpenAI"
      {...props}
    >
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  );
}

// 4. Google (Official 4-Color 'G')
export function GoogleLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-label="Google"
      {...props}
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

// 5. Gemini (Official 4-Color Gradient Star)
export function GeminiLogo({ size = 20, className, ...props }: BrandLogoProps) {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-label="Google Gemini"
      {...props}
    >
      <path
        d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
        fill="#3186FF"
      />
      <path
        d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
        fill={`url(#${id}-gemini-g)`}
      />
      <path
        d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
        fill={`url(#${id}-gemini-r)`}
      />
      <path
        d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
        fill={`url(#${id}-gemini-y)`}
      />
      <defs>
        <linearGradient id={`${id}-gemini-g`} gradientUnits="userSpaceOnUse" x1="7" x2="11" y1="15.5" y2="12">
          <stop stopColor="#08B962" />
          <stop offset="1" stopColor="#08B962" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-gemini-r`} gradientUnits="userSpaceOnUse" x1="8" x2="11.5" y1="5.5" y2="11">
          <stop stopColor="#F94543" />
          <stop offset="1" stopColor="#F94543" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-gemini-y`} gradientUnits="userSpaceOnUse" x1="3.5" x2="17.5" y1="13.5" y2="12">
          <stop stopColor="#FABC12" />
          <stop offset="0.46" stopColor="#FABC12" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 6. DeepSeek (Official Leaping Blue Whale)
export function DeepSeekLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("shrink-0 text-[#4D6BFE]", className)}
      aria-label="DeepSeek"
      {...props}
    >
      <path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z" />
    </svg>
  );
}

// 7. Kimi (Official Kimi Mark)
export function KimiLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("shrink-0 text-[#2B7FFF]", className)}
      aria-label="Kimi"
      {...props}
    >
      <path d="M21.765.351C22.998.351 24 1.353 24 2.586S22.998 4.82 21.765 4.82h-1.974c-.15 0-.26-.12-.26-.26V2.586A2.237 2.237 0 0 1 21.765.35M9.41 13.388l8.447-8.377c.16-.16.07-.471-.14-.471h-4.55s-.1.02-.14.06l-9.099 9.029c-.14.14-.35.02-.35-.21V4.81c0-.15-.1-.27-.221-.27H.22c-.12 0-.22.12-.22.27v18.57c0 .15.1.27.22.27h3.137c.12 0 .22-.12.22-.27v-3.79c0-.08.03-.16.08-.21l2.826-2.796c.07-.07.16-.08.241-.03l7.546 5.551a8.9 8.9 0 0 0 4.018 1.493c.12.01.23-.11.23-.27V19.76c0-.14-.08-.25-.19-.26a5.8 5.8 0 0 1-2.355-.942l-6.533-4.73c-.14-.09-.15-.32-.03-.441" />
    </svg>
  );
}

// 8. Moonshot AI (Official Moonshot Orbit Mark)
export function MoonshotLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("shrink-0 text-[#2B7FFF]", className)}
      aria-label="Moonshot AI"
      {...props}
    >
      <path d="M1.052 16.916l9.539 2.552a21.007 21.007 0 00.06 2.033l5.956 1.593a11.997 11.997 0 01-5.586.865l-.18-.016-.044-.004-.084-.009-.094-.01a11.605 11.605 0 01-.157-.02l-.107-.014-.11-.016a11.962 11.962 0 01-.32-.051l-.042-.008-.075-.013-.107-.02-.07-.015-.093-.019-.075-.016-.095-.02-.097-.023-.094-.022-.068-.017-.088-.022-.09-.024-.095-.025-.082-.023-.109-.03-.062-.02-.084-.025-.093-.028-.105-.034-.058-.019-.08-.026-.09-.031-.066-.024a6.293 6.293 0 01-.044-.015l-.068-.025-.101-.037-.057-.022-.08-.03-.087-.035-.088-.035-.079-.032-.095-.04-.063-.028-.063-.027a5.655 5.655 0 01-.041-.018l-.066-.03-.103-.047-.052-.024-.096-.046-.062-.03-.084-.04-.086-.044-.093-.047-.052-.027-.103-.055-.057-.03-.058-.032a6.49 6.49 0 01-.046-.026l-.094-.053-.06-.034-.051-.03-.072-.041-.082-.05-.093-.056-.052-.032-.084-.053-.061-.039-.079-.05-.07-.047-.053-.035a7.785 7.785 0 01-.054-.036l-.044-.03-.044-.03a6.066 6.066 0 01-.04-.028l-.057-.04-.076-.054-.069-.05-.074-.054-.056-.042-.076-.057-.076-.059-.086-.067-.045-.035-.064-.052-.074-.06-.089-.073-.046-.039-.046-.039a7.516 7.516 0 01-.043-.037l-.045-.04-.061-.053-.07-.062-.068-.06-.062-.058-.067-.062-.053-.05-.088-.084a13.28 13.28 0 01-.099-.097l-.029-.028-.041-.042-.069-.07-.05-.051-.05-.053a6.457 6.457 0 01-.168-.179l-.08-.088-.062-.07-.071-.08-.042-.049-.053-.062-.058-.068-.046-.056a7.175 7.175 0 01-.027-.033l-.045-.055-.066-.082-.041-.052-.05-.064-.02-.025a11.99 11.99 0 01-1.44-2.402zm-1.02-5.794l11.353 3.037a20.468 20.468 0 00-.469 2.011l10.817 2.894a12.076 12.076 0 01-1.845 2.005L.657 15.923l-.016-.046-.035-.104a11.965 11.965 0 01-.05-.153l-.007-.023a11.896 11.896 0 01-.207-.741l-.03-.126-.018-.08-.021-.097-.018-.081-.018-.09-.017-.084-.018-.094c-.026-.141-.05-.283-.071-.426l-.017-.118-.011-.083-.013-.102a12.01 12.01 0 01-.019-.161l-.005-.047a12.12 12.12 0 01-.034-2.145zm1.593-5.15l11.948 3.196c-.368.605-.705 1.231-1.01 1.875l11.295 3.022c-.142.82-.368 1.612-.668 2.365l-11.55-3.09L.124 10.26l.015-.1.008-.049.01-.067.015-.087.018-.098c.026-.148.056-.295.088-.442l.028-.124.02-.085.024-.097c.022-.09.045-.18.07-.268l.028-.102.023-.083.03-.1.025-.082.03-.096.026-.082.031-.095a11.896 11.896 0 011.01-2.232zm4.442-4.4L17.352 4.59a20.77 20.77 0 00-1.688 1.721l7.823 2.093c.267.852.442 1.744.513 2.665L2.106 5.213l.045-.065.027-.04.04-.055.046-.065.055-.076.054-.072.064-.086.05-.065.057-.073.055-.07.06-.074.055-.069.065-.077.054-.066.066-.077.053-.06.072-.082.053-.06.067-.074.054-.058.073-.078.058-.06.063-.067.168-.17.1-.098.059-.056.076-.071a12.084 12.084 0 012.272-1.677zM12.017 0h.097l.082.001.069.001.054.002.068.002.046.001.076.003.047.002.06.003.054.002.087.005.105.007.144.011.088.007.044.004.077.008.082.008.047.005.102.012.05.006.108.014.081.01.042.006.065.01.207.032.07.012.065.011.14.026.092.018.11.022.046.01.075.016.041.01L14.7.3l.042.01.065.015.049.012.071.017.096.024.112.03.113.03.113.032.05.015.07.02.078.024.073.023.05.016.05.016.076.025.099.033.102.036.048.017.064.023.093.034.11.041.116.045.1.04.047.02.06.024.041.018.063.026.04.018.057.025.11.048.1.046.074.035.075.036.06.028.092.046.091.045.102.052.053.028.049.026.046.024.06.033.041.022.052.029.088.05.106.06.087.051.057.034.053.032.096.059.088.055.098.062.036.024.064.041.084.056.04.027.062.042.062.043.023.017c.054.037.108.075.161.114l.083.06.065.048.056.043.086.065.082.064.04.03.05.041.086.069.079.065.085.071c.712.6 1.353 1.283 1.909 2.031L7.222.994l.062-.027.065-.028.081-.034.086-.035c.113-.045.227-.09.341-.131l.096-.035.093-.033.084-.03.096-.031c.087-.03.176-.058.264-.085l.091-.027.086-.025.102-.03.085-.023.1-.026L9.04.37l.09-.023.091-.022.095-.022.09-.02.098-.021.091-.02.095-.018.092-.018.1-.018.091-.016.098-.017.092-.014.097-.015.092-.013.102-.013.091-.012.105-.012.09-.01.105-.01c.093-.01.186-.018.28-.024l.106-.008.09-.005.11-.006.093-.004.1-.004.097-.002.099-.002.197-.002z" />
    </svg>
  );
}

// 9. Microsoft Azure (Official Faceted Cloud Mark)
export function AzureLogo({ size = 20, className, ...props }: BrandLogoProps) {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-label="Microsoft Azure"
      {...props}
    >
      <path
        d="M7.242 1.613A1.11 1.11 0 018.295.857h6.977L8.03 22.316a1.11 1.11 0 01-1.052.755h-5.43a1.11 1.11 0 01-1.053-1.466L7.242 1.613z"
        fill={`url(#${id}-azure-0)`}
      />
      <path
        d="M18.397 15.296H7.4a.51.51 0 00-.347.882l7.066 6.595c.206.192.477.298.758.298h6.226l-2.706-7.775z"
        fill="#0078D4"
      />
      <path
        d="M15.272.857H7.497L0 23.071h7.775l1.596-4.73 5.068 4.73h6.665l-2.707-7.775h-7.998L15.272.857z"
        fill={`url(#${id}-azure-1)`}
      />
      <path
        d="M17.193 1.613a1.11 1.11 0 00-1.052-.756h-7.81.035c.477 0 .9.304 1.052.756l6.748 19.992a1.11 1.11 0 01-1.052 1.466h-.12 7.895a1.11 1.11 0 001.052-1.466L17.193 1.613z"
        fill={`url(#${id}-azure-2)`}
      />
      <defs>
        <linearGradient id={`${id}-azure-0`} gradientUnits="userSpaceOnUse" x1="8.247" x2="1.002" y1="1.626" y2="23.03">
          <stop stopColor="#114A8B" />
          <stop offset="1" stopColor="#0669BC" />
        </linearGradient>
        <linearGradient id={`${id}-azure-1`} gradientUnits="userSpaceOnUse" x1="14.042" x2="12.324" y1="15.302" y2="15.888">
          <stop stopOpacity=".3" />
          <stop offset=".071" stopOpacity=".2" />
          <stop offset=".321" stopOpacity=".1" />
          <stop offset=".623" stopOpacity=".05" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-azure-2`} gradientUnits="userSpaceOnUse" x1="12.841" x2="20.793" y1="1.626" y2="22.814">
          <stop stopColor="#3CCBF4" />
          <stop offset="1" stopColor="#2892DF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 10. Google Cloud Vertex AI (Official Constellation / Cloud Mark)
export function VertexAILogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-label="Google Cloud Vertex AI"
      {...props}
    >
      <path
        d="M11.995 20.216a1.892 1.892 0 100 3.785 1.892 1.892 0 000-3.785zm0 2.806a.927.927 0 11.927-.914.914.914 0 01-.927.914z"
        fill="#4285F4"
      />
      <path
        clipRule="evenodd"
        d="M21.687 14.144c.237.038.452.16.605.344a.978.978 0 01-.18 1.3l-8.24 6.082a1.892 1.892 0 00-1.147-1.508l8.28-6.08a.991.991 0 01.682-.138z"
        fill="#669DF6"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M10.122 21.842l-8.217-6.066a.952.952 0 01-.206-1.287.978.978 0 011.287-.206l8.28 6.08a1.893 1.893 0 00-1.144 1.479z"
        fill="#AECBFA"
        fillRule="evenodd"
      />
      <path
        d="M4.273 4.475a.978.978 0 01-.965-.965V1.09a.978.978 0 111.943 0v2.42a.978.978 0 01-.978.965zM4.247 13.034a.978.978 0 100-1.956.978.978 0 000 1.956zM4.247 10.19a.978.978 0 100-1.956.978.978 0 000 1.956zM4.247 7.332a.978.978 0 100-1.956.978.978 0 000 1.956z"
        fill="#AECBFA"
      />
      <path
        d="M19.718 7.307a.978.978 0 01-.965-.979v-2.42a.965.965 0 011.93 0v2.42a.964.964 0 01-.965.979zM19.743 13.047a.978.978 0 100-1.956.978.978 0 000 1.956zM19.743 10.151a.978.978 0 100-1.956.978.978 0 000 1.956zM19.743 2.068a.978.978 0 100-1.956.978.978 0 000 1.956z"
        fill="#4285F4"
      />
      <path
        d="M11.995 15.917a.978.978 0 01-.965-.965v-2.459a.978.978 0 011.943 0v2.433a.976.976 0 01-.978.991zM11.995 18.762a.978.978 0 100-1.956.978.978 0 000 1.956zM11.995 10.64a.978.978 0 100-1.956.978.978 0 000 1.956zM11.995 7.783a.978.978 0 100-1.956.978.978 0 000 1.956z"
        fill="#669DF6"
      />
      <path
        d="M15.856 10.177a.978.978 0 01-.965-.965v-2.42a.977.977 0 011.702-.763.979.979 0 01.241.763v2.42a.978.978 0 01-.978.965zM15.869 4.913a.978.978 0 100-1.956.978.978 0 000 1.956zM15.869 15.853a.978.978 0 100-1.956.978.978 0 000 1.956zM15.869 12.996a.978.978 0 100-1.956.978.978 0 000 1.956z"
        fill="#4285F4"
      />
      <path
        d="M8.121 15.853a.978.978 0 100-1.956.978.978 0 000 1.956zM8.121 7.783a.978.978 0 100-1.956.978.978 0 000 1.956zM8.121 4.913a.978.978 0 100-1.957.978.978 0 000 1.957zM8.134 12.996a.978.978 0 01-.978-.94V9.611a.965.965 0 011.93 0v2.445a.966.966 0 01-.952.94z"
        fill="#AECBFA"
      />
    </svg>
  );
}

// 11. Mistral AI (Official Geometric Pixel Mark)
export function MistralLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-label="Mistral AI"
      {...props}
    >
      <rect x="3" y="3.5" width="3.6" height="3.4" rx="0.5" fill="#FF7000" />
      <rect x="17.4" y="3.5" width="3.6" height="3.4" rx="0.5" fill="#FF7000" />
      <rect x="3" y="7.5" width="7.2" height="3.4" rx="0.5" fill="#FF7000" />
      <rect x="13.8" y="7.5" width="7.2" height="3.4" rx="0.5" fill="#FF7000" />
      <rect x="3" y="11.5" width="18" height="3.4" rx="0.5" fill="#FF7000" />
      <rect x="3" y="15.5" width="3.6" height="3.4" rx="0.5" fill="#FF7000" />
      <rect x="10.2" y="15.5" width="3.6" height="3.4" rx="0.5" fill="#FF7000" />
      <rect x="17.4" y="15.5" width="3.6" height="3.4" rx="0.5" fill="#FF7000" />
      <rect x="3" y="19.5" width="3.6" height="3.4" rx="0.5" fill="#FF7000" />
      <rect x="17.4" y="19.5" width="3.6" height="3.4" rx="0.5" fill="#FF7000" />
    </svg>
  );
}

// 12. Meta / Llama (Official Infinity Ribbon)
export function MetaLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#0668E1"
      className={cn("shrink-0", className)}
      aria-label="Meta"
      {...props}
    >
      <path d="M12 6.5c-2.4 0-4.5 1.3-5.7 3.3C4.8 7.7 2.6 6.5 0 6.5v2.8c2.2 0 4 1.5 4.8 3.5-.8 2-2.6 3.5-4.8 3.5v2.8c2.6 0 4.8-1.2 6.3-3.3 1.2 2 3.3 3.3 5.7 3.3s4.5-1.3 5.7-3.3c1.5 2.1 3.7 3.3 6.3 3.3v-2.8c-2.2 0-4-1.5-4.8-3.5.8-2 2.6-3.5 4.8-3.5V6.5c-2.6 0-4.8 1.2-6.3 3.3-1.2-2-3.3-3.3-5.7-3.3zm0 3.2c1.7 0 3.2 1.3 3.8 3.1-.6 1.8-2.1 3.1-3.8 3.1s-3.2-1.3-3.8-3.1c.6-1.8 2.1-3.1 3.8-3.1z" />
    </svg>
  );
}

// 13. Groq (Official Speed G Mark)
export function GroqLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-label="Groq"
      {...props}
    >
      <rect width="24" height="24" rx="6" fill="#F55036" />
      <path
        d="M16 12a4 4 0 1 1-4-4h4v3h-4a1 1 0 1 0 1 1h3z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 14. Perplexity (Official Asterisk Mark)
export function PerplexityLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0 text-[#22B8CD]", className)}
      fill="currentColor"
      aria-label="Perplexity"
      {...props}
    >
      <path d="M11 2v8.586L4.707 4.293 3.293 5.707 9.586 12l-6.293 6.293 1.414 1.414L11 13.414V22h2v-8.586l6.293 6.293 1.414-1.414L14.414 12l6.293-6.293-1.414-1.414L13 10.586V2h-2z" />
    </svg>
  );
}

// 15. Amazon AWS / Bedrock
export function AWSLogo({ size = 20, className, ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-label="Amazon AWS Bedrock"
      {...props}
    >
      <path
        d="M18.8 14.8c-2.4 1.8-6.1 2.7-9.1 2.7-4.3 0-8.2-1.6-11.1-4.2-.2-.2 0-.5.3-.3 3.2 1.8 7.1 2.9 11.1 2.9 2.7 0 5.9-.7 8.3-2 .4-.2.8.2.5.9z"
        fill="#FF9900"
      />
      <path
        d="M19.7 13.3c-.3-.4-1.9-.2-2.7-.1-.2 0-.3-.2-.1-.3 1.2-.8 3.1-.6 3.3-.3.2.3-.2 2.2-1.3 3.1-.2.1-.3.1-.4-.1.2-.8.8-1.9 1.2-2.3z"
        fill="#FF9900"
      />
      <path
        d="M14.5 4.5h-2.2l-3.2 9.5h2.2l.6-2h3l.6 2h2.2l-3.2-9.5zm-2 5.7.9-3.2.9 3.2h-1.8z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// Fallback Generic AI Model / Provider Logo
export function GenericAILogo({ name, size = 20, className, ...props }: BrandLogoProps) {
  const initial = (name?.charAt(0) || "A").toUpperCase();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0 text-accent", className)}
      {...props}
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text
        x="12"
        y="16"
        fontSize="11"
        fontWeight="600"
        fontFamily="sans-serif"
        textAnchor="middle"
        fill="currentColor"
      >
        {initial}
      </text>
    </svg>
  );
}

// Brand Normalizer & Resolver
export function resolveBrand(identifier?: string | null): string {
  if (!identifier) return "unknown";
  const str = identifier.toLowerCase().trim();

  // Claude / Anthropic
  if (str.includes("claude")) {
    return "claude";
  }
  if (str.includes("anthropic")) {
    return "anthropic";
  }

  // OpenAI
  if (
    str.includes("openai") ||
    str.startsWith("gpt") ||
    str.includes("chatgpt") ||
    str.includes("dall-e") ||
    str.includes("sora") ||
    str.includes("text-embedding")
  ) {
    return "openai";
  }

  // Google / Gemini
  if (str.includes("gemini") || str.includes("gemma")) {
    return "gemini";
  }
  if (
    str.includes("google ai studio") ||
    str.includes("aistudio") ||
    str === "google"
  ) {
    return "google";
  }
  if (str.includes("vertex") || str.includes("google cloud")) {
    return "vertex";
  }

  // DeepSeek
  if (str.includes("deepseek") || str.includes("deep-seek") || str.includes("deep_seek")) {
    return "deepseek";
  }

  // Kimi / Moonshot
  if (str.includes("moonshot")) {
    return "moonshot";
  }
  if (str.includes("kimi")) {
    return "kimi";
  }

  // Microsoft Azure
  if (str.includes("azure") || str.includes("microsoft")) {
    return "azure";
  }

  // Meta / Llama
  if (str.includes("meta") || str.includes("llama")) {
    return "meta";
  }

  // Mistral
  if (str.includes("mistral") || str.includes("mixtral") || str.includes("codestral")) {
    return "mistral";
  }

  // Groq
  if (str.includes("groq")) {
    return "groq";
  }

  // Perplexity
  if (str.includes("perplexity") || str.includes("sonar")) {
    return "perplexity";
  }

  // AWS Bedrock
  if (str.includes("bedrock") || str.includes("aws") || str.includes("amazon")) {
    return "aws";
  }

  return "unknown";
}

/**
 * Universal BrandLogo component that renders the authentic SVG logo
 * based on brand / company / provider name or slug.
 */
export function BrandLogo({ name, size = 20, className, ...props }: BrandLogoProps) {
  const brand = resolveBrand(name);

  switch (brand) {
    case "claude":
      return <ClaudeLogo size={size} className={className} {...props} />;
    case "anthropic":
      return <AnthropicLogo size={size} className={className} {...props} />;
    case "openai":
      return <OpenAILogo size={size} className={className} {...props} />;
    case "gemini":
      return <GeminiLogo size={size} className={className} {...props} />;
    case "google":
      return <GoogleLogo size={size} className={className} {...props} />;
    case "vertex":
      return <VertexAILogo size={size} className={className} {...props} />;
    case "deepseek":
      return <DeepSeekLogo size={size} className={className} {...props} />;
    case "kimi":
      return <KimiLogo size={size} className={className} {...props} />;
    case "moonshot":
      return <MoonshotLogo size={size} className={className} {...props} />;
    case "azure":
      return <AzureLogo size={size} className={className} {...props} />;
    case "meta":
      return <MetaLogo size={size} className={className} {...props} />;
    case "mistral":
      return <MistralLogo size={size} className={className} {...props} />;
    case "groq":
      return <GroqLogo size={size} className={className} {...props} />;
    case "perplexity":
      return <PerplexityLogo size={size} className={className} {...props} />;
    case "aws":
      return <AWSLogo size={size} className={className} {...props} />;
    default:
      return <GenericAILogo name={name} size={size} className={className} {...props} />;
  }
}

/**
 * ModelLogo - Smart component to render the correct brand logo for an AI model
 * Prioritizes model family name (e.g. Claude -> Claude icon, Gemini -> Gemini icon, GPT -> OpenAI icon),
 * falling back to company name.
 */
export function ModelLogo({
  model,
  size = 20,
  className,
  ...props
}: {
  model: AIModel | { name: string; slug?: string; company?: Company | { name: string } };
  size?: number | string;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  const modelName = model?.name || "";
  const modelSlug = model?.slug || "";
  const companyName = model?.company?.name || "";

  const brand =
    resolveBrand(modelName) !== "unknown"
      ? modelName
      : resolveBrand(modelSlug) !== "unknown"
      ? modelSlug
      : companyName;

  return <BrandLogo name={brand} size={size} className={className} {...props} />;
}

/**
 * ProviderLogo - Smart component to render the correct brand logo for a Provider
 */
export function ProviderLogo({
  provider,
  size = 20,
  className,
  ...props
}: {
  provider: Provider | ModelProvider | { name: string; website?: string | null };
  size?: number | string;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <BrandLogo
      name={provider?.name || ""}
      size={size}
      className={className}
      {...props}
    />
  );
}

// Re-export SyncRouter custom brand logos
export {
  SyncRouterIcon,
  SyncRouterMark,
  SyncRouterLogo,
} from "./sync-router-logo";
