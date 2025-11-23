(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=t(a);fetch(a.href,s)}})();class j{constructor(e){this.routes=new Map,this.target=e,window.addEventListener("hashchange",()=>this.handleRoute())}register(e){this.routes.set(e.path,e.render)}init(){if(!location.hash){this.navigate("/auth",{replace:!0});return}this.handleRoute()}navigate(e,t){t!=null&&t.replace?(history.replaceState(null,"",`#${e}`),this.handleRoute()):location.hash=e}handleRoute(){const e=location.hash.replace(/^#/,"")||"/auth",[t]=e.split("?"),i=t||"/auth",a=this.routes.get(i);if(a){this.currentCleanup&&(this.currentCleanup(),this.currentCleanup=void 0),this.target.innerHTML="";const s=a(this.target);typeof s=="function"&&(this.currentCleanup=s)}}}const z="transcendence_user",M=r=>{localStorage.setItem(z,JSON.stringify(r))},T=()=>{const r=localStorage.getItem(z);if(!r)return null;try{return JSON.parse(r)}catch{return k(),null}},k=()=>{localStorage.removeItem(z)},E=r=>r.replace(/[&<>'"]/g,e=>{switch(e){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";case"'":return"&#39;";default:return e}}),H=r=>{const e=T(),t=document.createElement("div");if(t.className="session-banner",!e)return t.classList.add("session-banner--empty"),t.innerHTML=`
      <div>
        <strong>Hazırsın.</strong> Kaydol veya giriş yap, oyuna başlayalım.
      </div>
    `,t;t.innerHTML=`
    <p>Giriş yapıldı: <strong>${E(e.nickname)}</strong> (${E(e.email)})</p>
    <div class="session-banner__actions">
      <button class="button" type="button" data-action="play">Play Now</button>
      <button class="button button--secondary" type="button" data-action="logout">Çıkış</button>
    </div>
  `;const i=t.querySelector('[data-action="play"]');i&&i.addEventListener("click",()=>{location.hash="/dashboard"});const a=t.querySelector('[data-action="logout"]');return a&&a.addEventListener("click",async()=>{const s=()=>{location.hash!=="#/auth"&&location.replace(`${location.origin}/#/auth`)};s();try{await fetch("/api/users/logout",{method:"POST",credentials:"include"})}catch(l){console.warn("Logout isteği başarısız oldu:",l)}finally{k(),r(),s()}}),t},$=r=>typeof r=="string"?r:"",A=(r,e,t,i,a)=>{const s=[a!=null&&a.minlength?`minlength="${a.minlength}"`:"",a!=null&&a.maxlength?`maxlength="${a.maxlength}"`:""].filter(Boolean).join(" ");let l=a==null?void 0:a.autocomplete;return l||(e==="email"?l="email":e==="password"?l="current-password":e==="nickname"&&(l="username")),`
    <label class="flex flex-col gap-3">
      <span class="text-sm font-bold text-slate-800 tracking-wide">${r}</span>
      <input 
        type="${t}" 
        name="${e}" 
        required 
        ${s} 
        placeholder="${i}"
        ${l?`autocomplete="${l}"`:""}
        class="w-full px-5 py-4 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 shadow-sm hover:shadow-md hover:border-slate-300"
      />
      <small data-feedback-for="${e}" class="text-xs text-red-600 mt-1 min-h-[16px] font-medium"></small>
    </label>
  `},G=[{formId:"manual-register-form",title:"Manuel Kayıt",buttonLabel:"Kaydı Gönder",renderFields:()=>`
      ${A("E-posta","email","email","ornek@mail.com")}
      ${A("Kullanıcı adı","nickname","text","nickname",{minlength:3,maxlength:48})}
      ${A("Şifre","password","password","En az 8 karakter",{minlength:8,autocomplete:"new-password"})}
    `},{formId:"manual-login-form",title:"Manuel Giriş",buttonLabel:"Giriş Yap",renderFields:()=>`
      ${A("E-posta","email","email","ornek@mail.com")}
      ${A("Şifre","password","password","Şifren",{autocomplete:"current-password"})}
    `}],R=r=>{const e=Number(r.id),t=r.email,i=r.nickname,a=r.provider;return Number.isNaN(e)||typeof t!="string"||typeof i!="string"||a!=="local"&&a!=="google"?null:{id:e,email:t,nickname:i,provider:a}},Y=r=>[{formId:"manual-register-form",endpoint:"/api/users/register",buildPayload:e=>({email:$(e.get("email")),nickname:$(e.get("nickname")),password:$(e.get("password"))}),successMessage:e=>`Kayıt tamamlandı: ${e.nickname??"kullanıcı"} (id: ${e.id}).`},{formId:"manual-login-form",endpoint:"/api/users/login",buildPayload:e=>({email:$(e.get("email")),password:$(e.get("password"))}),successMessage:()=>"Giriş başarılı. Oturum cookie üzerinde saklandı.",onSuccess:e=>{const t=R(e);t&&(M(t),r())}}],P=(r,e,t,i="")=>{const a=r.querySelector(`.status[data-status-for="${e}"]`);if(a){if(a.classList.remove("bg-green-50","text-green-800","border-green-200","bg-red-50","text-red-800","border-red-200","bg-blue-50","text-blue-800","border-blue-200","hidden"),t==="loading"){a.innerHTML=`
      <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>İstek gönderiliyor...</span>
    `,a.classList.add("bg-blue-50","text-blue-800","border-blue-300"),a.style.display="flex",a.classList.remove("hidden");return}if(!i){a.innerHTML="",a.classList.add("hidden"),a.style.display="none";return}a.style.display="flex",a.classList.remove("hidden"),t==="success"?(a.innerHTML=`
      <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="font-bold">${i}</span>
    `,a.classList.add("bg-green-100","text-green-900","border-green-400","shadow-lg")):t==="error"&&(a.innerHTML=`
      <svg class="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="font-bold">${i}</span>
    `,a.classList.add("bg-red-100","text-red-900","border-red-400","shadow-lg"))}},K=async()=>{try{const r=await fetch("/api/users/refresh",{method:"POST",credentials:"include"});if(!r.ok)return!1;const e=r.headers.get("content-type");if(e&&e.includes("application/json"))try{const t=await r.json();return M(t),!0}catch{return!1}else return!1}catch(r){return console.warn("Oturum yenilemesi sırasında hata oluştu:",r),!1}},W=async r=>{try{const e=await fetch("/api/users/me",{credentials:"include"});if(e.ok){const t=e.headers.get("content-type");if(t&&t.includes("application/json"))try{const i=await e.json();M(i)}catch{k()}else k()}else e.status===401&&await K()||k()}catch{}finally{r()}},V=()=>{const r=window.location.hash;if(!r.includes("?"))return null;const[e,t]=r.split("?"),i=new URLSearchParams(t),a=i.get("oauth");if(!a)return null;i.delete("oauth");const s=i.toString(),l=s?`${e}?${s}`:e||"#/auth";return history.replaceState(null,"",l),a},F={success:{type:"success",message:"Google ile giriş tamamlandı."},denied:{type:"error",message:"Google yetkilendirmesi iptal edildi."},missing_params:{type:"error",message:"Google dönüşünde gerekli parametreler eksikti."},state_mismatch:{type:"error",message:"Oturum doğrulaması zaman aşımına uğradı, lütfen tekrar deneyin."},token_error:{type:"error",message:"Google token alınırken hata oluştu."},profile_error:{type:"error",message:"Google profil bilgileri okunamadı."},email_unverified:{type:"error",message:"Google hesabınız doğrulanmamış bir e-posta içeriyor."},email_conflict:{type:"error",message:"Bu e-posta zaten manuel kayıtla kullanıldığı için Google ile bağlanamadı."},internal_error:{type:"error",message:"Google OAuth akışında beklenmeyen bir hata oluştu."}},U=()=>{const r=V(),e=document.createElement("main");e.className="min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",e.innerHTML=`
    <header class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center">
          <h1 class="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
            Transcendence
          </h1>
        </div>
      </div>
    </header>
  `;const t=document.createElement("section");t.className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto items-start mt-16 lg:mt-24 pb-16";const i=document.createElement("div");i.className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[260px] lg:sticky lg:top-24";const a=document.createElement("div");a.className="flex-1 w-full min-w-0",t.append(i,a),e.appendChild(t),G.forEach((o,c)=>{const g=document.createElement("section"),C=o.formId==="manual-register-form";g.className="form-section rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10",g.dataset.section=o.formId,C?g.style.display="block":g.style.display="none",g.innerHTML=`
      <div class="mb-8">
        <h2 class="text-3xl font-extrabold text-slate-900 mb-2">${o.title}</h2>
        <div class="h-1 w-20 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full"></div>
      </div>
      <form id="${o.formId}" class="flex flex-col gap-6">
        ${o.renderFields()}
        <button type="submit" class="w-full px-6 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform">
          ${o.buttonLabel}
        </button>
      </form>
      <div class="status mt-6 p-5 rounded-xl text-base font-semibold flex items-center gap-3 border-2 hidden min-h-[60px]" data-status-for="${o.formId}"></div>
    `,a.appendChild(g)});const s=e.querySelector(".app__header"),l=document.createElement("div");l.className="hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4",s==null||s.insertAdjacentElement("afterend",l),(o=>{if(!o){l.classList.add("hidden"),l.innerHTML="",l.classList.remove("bg-green-50","text-green-800","border-green-200","bg-red-50","text-red-800","border-red-200");return}const c=F[o]??{type:"error",message:"Google OAuth akışı tamamlanamadı."};l.classList.remove("bg-green-50","text-green-800","border-green-200","bg-red-50","text-red-800","border-red-200","hidden"),l.innerHTML=`
      <div class="rounded-2xl border-2 p-5 backdrop-blur-xl shadow-2xl ${c.type==="success"?"bg-green-500/20 text-green-100 border-green-400/30 ring-2 ring-green-500/20":"bg-red-500/20 text-red-100 border-red-400/30 ring-2 ring-red-500/20"}">
        <div class="flex items-center">
          ${c.type==="success"?'<svg class="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>':'<svg class="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>'}
          <span class="font-bold text-base">${c.message}</span>
        </div>
      </div>
    `})(r),Array.from(a.querySelectorAll(".form-section"));const b=`
    <span class="flex-shrink-0 mr-2" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" role="img">
        <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-2 3l3.2 2.5c1.9-1.8 3-4.5 3-7.5 0-.7-.1-1.3-.2-1.9H12z"/>
        <path fill="#34A853" d="M5.3 14.3 4.4 15.7 1.4 17.8C3.4 21.2 7.4 24 12 24c3 0 5.5-1 7.3-2.7l-3.2-2.5c-.9.6-2 1-3.1 1-2.4 0-4.5-1.6-5.2-3.8z"/>
        <path fill="#4A90E2" d="M1.4 6.2C.5 7.9 0 9.9 0 12s.5 4.1 1.4 5.8l3.9-3c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2z"/>
        <path fill="#FBBC05" d="M12 4.8c1.6 0 3 .6 4 1.6l3-3C17.5 1.3 15 0 12 0 7.4 0 3.4 2.8 1.4 6.2l3.9 3.1c.7-2.2 2.8-3.8 5.2-3.8z"/>
      </svg>
    </span>
  `,f=[{id:"manual-register-form",label:"Kayıt Ol",type:"form"},{id:"manual-login-form",label:"Giriş Yap",type:"form"},{id:"google",label:"Google ile Devam Et",type:"google"}],p=o=>{Array.from(a.querySelectorAll(".form-section")).forEach(g=>{g.dataset.section===o?(g.style.display="block",g.classList.remove("hidden")):(g.style.display="none",g.classList.add("hidden"))})},h=o=>{i.querySelectorAll("button[data-target]").forEach(c=>{const g=c.dataset.target===o;c.dataset.target!=="google"&&(g?(c.classList.remove("bg-slate-100","text-slate-700","hover:bg-slate-200"),c.classList.add("bg-gradient-to-r","from-sky-500","to-indigo-600","text-white")):(c.classList.remove("bg-gradient-to-r","from-sky-500","to-indigo-600","text-white","shadow-lg","shadow-sky-500/50"),c.classList.add("bg-white/10","text-slate-300","hover:bg-white/20","backdrop-blur-sm","border-white/20")))})};f.forEach(o=>{const c=document.createElement("button");c.type="button",c.dataset.target=o.id;const g="px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 w-full border-2";o.type==="google"?(c.className=`${g} bg-white/95 backdrop-blur-sm text-slate-800 border-white/30 hover:bg-white hover:border-white/50 hover:shadow-lg hover:scale-[1.02] transform`,c.innerHTML=`${b}<span>${o.label}</span>`):(c.className=`${g} bg-white/10 text-slate-300 hover:bg-white/20 backdrop-blur-sm border-white/20 hover:scale-[1.02] transform`,c.innerHTML=`<span>${o.label}</span>`),c.addEventListener("click",()=>{if(o.type==="google"){window.location.href="/api/users/oauth/google/start";return}h(o.id),p(o.id)}),i.appendChild(c)}),h("manual-register-form"),p("manual-register-form");const d=document.createElement("section");d.className="hidden max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24",d.innerHTML=`
    <div class="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg border border-green-200 text-center">
      <div class="mb-6">
        <svg class="w-16 h-16 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h2 class="text-3xl font-bold text-slate-900 mb-4">Giriş Başarılı!</h2>
      <p class="text-lg text-slate-700 mb-8">
        Artık oyuna bağlanabilirsin. "Play Now" düğmesi seni doğrudan oyun ekranına götürür.
      </p>
      <button type="button" class="w-full px-8 py-4 rounded-lg font-semibold text-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
        Play Now
      </button>
    </div>
  `,e.appendChild(d);const n=d.querySelector("button");n&&n.addEventListener("click",()=>{location.hash="/game"});const u=()=>{if(!s)return;const o=H(u),c=s.querySelector(".session-banner");c?c.replaceWith(o):s.appendChild(o)};u();const y=()=>{!!T()?(t.classList.add("hidden"),d.classList.remove("hidden")):(t.classList.remove("hidden"),d.classList.add("hidden"))},L=()=>{const o=!!T(),c=location.hash.replace("#","");o&&c==="/auth"?location.hash="/dashboard":!o&&c!=="/auth"&&(location.hash="/auth")};y(),L();const x=()=>{u(),y(),L()};return Y(x).forEach(o=>{const c=e.querySelector(`#${o.formId}`);c&&(X(c),c.addEventListener("submit",async g=>{var B,q;g.preventDefault();const C=new FormData(c);if(!c.checkValidity()){c.reportValidity();return}P(e,o.formId,"loading");try{const S=await fetch(o.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(o.buildPayload(C))}),w=await S.clone().json().catch(()=>{});if(!S.ok){const v=await S.clone().text().catch(()=>"İstek başarısız oldu."),I=(w==null?void 0:w.message)??(v.startsWith("<")?"İstek başarısız oldu.":v);P(e,o.formId,"error",I);return}w?((B=o.onSuccess)==null||B.call(o,w),P(e,o.formId,"success",o.successMessage(w)),setTimeout(()=>{const v=e.querySelector(`.status[data-status-for="${o.formId}"]`);v&&(v.classList.add("hidden"),v.style.display="none")},1e4)):((q=o.onSuccess)==null||q.call(o,{}),P(e,o.formId,"success",o.successMessage({})),setTimeout(()=>{const v=e.querySelector(`.status[data-status-for="${o.formId}"]`);v&&(v.classList.add("hidden"),v.style.display="none")},1e4)),c.reset()}catch(S){const w=S instanceof Error?S.message:"Beklenmeyen bir hata oluştu.";P(e,o.formId,"error",w)}}))}),W(x),e},X=r=>{Array.from(r.querySelectorAll("input[name]")).forEach(t=>{const i=r.querySelector(`[data-feedback-for="${t.name}"]`);if(!i)return;const a=()=>{if(t.validity.valid){i.textContent="",t.classList.remove("border-red-500","ring-red-500"),t.classList.add("border-slate-300");return}let s="";t.validity.valueMissing?s="Bu alan zorunlu.":t.validity.typeMismatch&&t.type==="email"?s="Lütfen geçerli bir e-posta gir.":t.validity.tooShort?s=`En az ${t.minLength} karakter olmalı.`:t.validity.tooLong?s=`En fazla ${t.maxLength} karakter olabilir.`:t.validity.patternMismatch&&(s="Girdi beklenen formata uymuyor."),i.textContent=s,s&&(t.classList.remove("border-slate-300","ring-sky-500"),t.classList.add("border-red-500","ring-red-500"))};t.addEventListener("input",a),t.addEventListener("blur",a)})},J=r=>{const e=U();r.appendChild(e)},Q=r=>{const e=new Date(r);return Number.isNaN(e.getTime())?"-":e.toLocaleString()},Z=r=>{let e=T();if(!e){location.hash="/auth";return}r.className="",r.style.cssText="";const t=document.createElement("main");t.className="min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",t.innerHTML=`
    <header class="bg-white/98 backdrop-blur-xl shadow-2xl border-b-2 border-white/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div class="flex-1">
            <p class="uppercase text-xs tracking-wider text-slate-500 mb-3 font-bold">Profil</p>
            <h1 class="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight mb-3" data-profile-field="nickname">${E(e.nickname)}</h1>
            <div class="flex flex-wrap items-center gap-2 text-slate-600">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
                <span data-profile-field="email">${E(e.email)}</span>
              </span>
              <span class="text-slate-400">•</span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span data-profile-field="provider">${e.provider==="google"?"Google":"Manuel"} giriş</span>
              </span>
            </div>
          </div>
          <div class="flex gap-3 flex-wrap justify-end w-full sm:w-auto">
            <button class="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white transition-all duration-300 hover:from-sky-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-sky-500/50 hover:scale-105 transform" type="button" data-action="play">Play Now</button>
            <button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-sky-600 border-2 border-sky-500/30 transition-all duration-300 hover:bg-sky-500/20 hover:border-sky-500/50 hover:scale-105 transform" type="button" data-action="tournaments">Turnuvalar</button>
            <button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-red-600 border-2 border-red-500/30 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/50 hover:scale-105 transform" type="button" data-action="logout">Çıkış</button>
          </div>
        </div>
      </div>
    </header>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section class="dashboard__card">
        <h2>Hesap Özeti</h2>
        <dl class="dashboard__list">
          <div>
            <dt>Kullanıcı ID</dt>
            <dd data-profile-field="id">#${e.id}</dd>
          </div>
          <div>
            <dt>Takma Ad</dt>
            <dd>
              <div class="dashboard__nickname">
                <span data-profile-field="nicknameInline">${E(e.nickname)}</span>
                <button class="icon-button" type="button" data-action="edit-nickname" aria-label="Takma adı düzenle">
                  ✏️
                </button>
              </div>
              <form class="dashboard__nickname-form is-hidden" data-nickname-form>
                <input type="text" name="nickname" data-nickname-input value="${E(e.nickname)}" minlength="3" maxlength="48" required/>
                <div class="dashboard__nickname-actions">
                  <button class="button button--small" type="submit">Kaydet</button>
                  <button class="button button--secondary button--small" type="button" data-action="cancel-nickname">Vazgeç</button>
                </div>
                <p class="status" data-status="nickname"></p>
              </form>
            </dd>
          </div>
          <div>
            <dt>Giriş Provider</dt>
            <dd data-profile-field="providerLabel">${e.provider==="google"?"Google OAuth":"Local (manuel)"}</dd>
          </div>
          <div>
            <dt>Katılım Tarihi</dt>
            <dd data-profile-field="createdAt">-</dd>
          </div>
        </dl>
      </section>
      <section class="dashboard__card dashboard__card--placeholder">
        <h2>Turnuva / Oyun Durumu</h2>
        <p>Turnuva sistemi bu alanda listelenecek. Şimdilik Play Now ile Pong’a geçebilirsin.</p>
      </section>
    </div>
  `,r.appendChild(t);const i=n=>{if(!e)return;e={id:n.id,email:n.email,nickname:n.nickname,provider:n.provider},M(e);const u=(y,L)=>{const x=t.querySelector(y);x&&(x.textContent=L)};u('[data-profile-field="nickname"]',n.nickname),u('[data-profile-field="email"]',n.email),u('[data-profile-field="provider"]',n.provider==="google"?"Google giriş":"Manuel giriş"),u('[data-profile-field="id"]',`#${n.id}`),u('[data-profile-field="nicknameInline"]',n.nickname),u('[data-profile-field="providerLabel"]',n.provider==="google"?"Google OAuth":"Local (manuel)"),u('[data-profile-field="createdAt"]',Q(n.createdAt))};fetch("/api/users/profile",{credentials:"include"}).then(async n=>{if(!n.ok){n.status===401&&(k(),location.hash="/auth");return}const u=await n.json();i(u)}).catch(n=>{console.warn("Profil bilgisi alınamadı:",n)});const a=t.querySelector('[data-action="play"]');a==null||a.addEventListener("click",()=>{location.hash="/game"});const s=t.querySelector('[data-action="tournaments"]');s==null||s.addEventListener("click",()=>{location.hash="/tournament"});const l=t.querySelector('[data-action="logout"]');l==null||l.addEventListener("click",async()=>{const n=()=>{location.hash!=="#/auth"&&location.replace(`${location.origin}/#/auth`)};n();try{await fetch("/api/users/logout",{method:"POST",credentials:"include"})}catch(u){console.warn("Logout isteği başarısız oldu:",u)}finally{k(),n()}});const m=t.querySelector("[data-nickname-form]"),b=t.querySelector("[data-nickname-input]"),f=t.querySelector('[data-status="nickname"]'),p=t.querySelector('[data-action="edit-nickname"]'),h=t.querySelector('[data-action="cancel-nickname"]'),d=n=>{m==null||m.classList.toggle("is-hidden",!n),p==null||p.classList.toggle("is-hidden",n),n?(b==null||b.focus(),b==null||b.select()):f&&(f.textContent="")};p==null||p.addEventListener("click",()=>{b&&e&&(b.value=e.nickname),d(!0)}),h==null||h.addEventListener("click",()=>{d(!1)}),m==null||m.addEventListener("submit",async n=>{if(n.preventDefault(),!b)return;const u=b.value.trim();if(u.length<3||u.length>48){f&&(f.textContent="Takma ad 3-48 karakter arası olmalı.");return}f.textContent="Kaydediliyor...";try{const y=await fetch("/api/users/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({nickname:u})});if(!y.ok){const x=await y.json().catch(()=>null);f.textContent=(x==null?void 0:x.message)??"Güncelleme başarısız oldu.";return}const L=await y.json();i(L),f.textContent="Güncellendi.",d(!1)}catch(y){console.warn("Takma ad güncellenemedi:",y),f.textContent="Beklenmeyen bir hata oluştu."}})},ee=1.79672131148,te=10,O=10,ae=360,N=10,se=(r,e,t,i)=>{const a=r.getContext("2d");if(!a)throw new Error("Canvas 2D context alınamadı.");const s=new re(a,r,e,t,i);s.resize(window.innerHeight*.6);const l=new Set,m=d=>{(d.key==="ArrowUp"||d.key==="ArrowDown")&&d.preventDefault(),l.add(d.key.toLowerCase())},b=d=>{l.delete(d.key.toLowerCase())},f=()=>{s.resize(window.innerHeight*.6)};window.addEventListener("keydown",m),window.addEventListener("keyup",b),window.addEventListener("resize",f);let p=0;const h=()=>{s.tick(l),p=requestAnimationFrame(h)};return h(),()=>{cancelAnimationFrame(p),window.removeEventListener("keydown",m),window.removeEventListener("keyup",b),window.removeEventListener("resize",f)}};class re{constructor(e,t,i,a,s){this.ctx=e,this.canvas=t,this.scoreAEl=i,this.scoreBEl=a,this.statusEl=s,this.width=0,this.height=0,this.paddle1x=20,this.paddle2x=20,this.paddle1y=0,this.paddle2y=0,this.paddleLength=0,this.paddleWidth=10,this.ballSize=0,this.ballX=0,this.ballY=0,this.ballDx=0,this.ballDy=0,this.scoreA=0,this.scoreB=0,this.awaitingServe=!0,this.winner=null,this.nextServeDirection=Math.random()>.5?1:-1}tick(e){this.handleInput(e),this.awaitingServe||(this.updateBall(),this.resolveCollisions()),this.drawFrame()}resize(e){const t=Math.max(ae,e),i=t*ee;this.height=t,this.width=i,this.canvas.height=t,this.canvas.width=i,this.paddleLength=i/17.96,this.ballSize=i/68.5,this.paddle2x=i-20,this.resetPositions("Paddle hareket ettirerek servisi başlat."),this.updateScoreboard()}handleInput(e){let t=!1;e.has("w")&&(t=this.updatePaddle(0,-1)||t),e.has("s")&&(t=this.updatePaddle(0,1)||t),e.has("arrowup")&&(t=this.updatePaddle(1,-1)||t),e.has("arrowdown")&&(t=this.updatePaddle(1,1)||t),t&&this.activateBall()}updatePaddle(e,t){const i=t*te;if(e===0){const l=this.clampPaddle(this.paddle1y+i),m=l!==this.paddle1y;return this.paddle1y=l,m}const a=this.clampPaddle(this.paddle2y+i),s=a!==this.paddle2y;return this.paddle2y=a,s}clampPaddle(e){const i=this.height-this.paddleLength;return Math.min(Math.max(e,0),i)}activateBall(){this.awaitingServe&&(this.winner&&(this.scoreA=0,this.scoreB=0,this.updateScoreboard(),this.winner=null,this.nextServeDirection=Math.random()>.5?1:-1),this.awaitingServe=!1,this.statusEl.textContent="",this.ballDx=this.nextServeDirection,this.ballDy=(Math.random()-.5)*.6)}updateBall(){this.ballX+=this.ballDx*O,this.ballY+=this.ballDy*O}resolveCollisions(){const e=this.ballY-this.ballSize/2<=0,t=this.ballY+this.ballSize/2>=this.height;if((e||t)&&(this.ballDy*=-1),this.ballX-this.ballSize/2<=0){this.goal("b");return}if(this.ballX+this.ballSize/2>=this.width){this.goal("a");return}this.ballDx<0&&this.ballX-this.ballSize/2<=this.paddle1x+this.paddleWidth&&this.ballY>=this.paddle1y&&this.ballY<=this.paddle1y+this.paddleLength&&this.deflectFromPaddle(this.paddle1y,1),this.ballDx>0&&this.ballX+this.ballSize/2>=this.paddle2x-this.paddleWidth&&this.ballY>=this.paddle2y&&this.ballY<=this.paddle2y+this.paddleLength&&this.deflectFromPaddle(this.paddle2y,-1)}deflectFromPaddle(e,t){const s=(this.ballY-(e+this.paddleLength/2))/(this.paddleLength/2)*(Math.PI/4),l=Math.hypot(this.ballDx,this.ballDy)||1;this.ballDx=t*Math.cos(s)*l,this.ballDy=Math.sin(s)*l}goal(e){if(e==="a"?(this.scoreA+=1,this.nextServeDirection=1):(this.scoreB+=1,this.nextServeDirection=-1),this.updateScoreboard(),this.scoreA>=N||this.scoreB>=N){this.handleWin(e);return}this.resetPositions("Puan sonrası paddle hareketiyle oyun devam eder.")}handleWin(e){this.winner=e;const t=e==="a"?"Oyuncu A":"Oyuncu B";this.resetPositions(`${t} 10 puana ulaştı! Paddle hareket ettirerek yeni maçı başlat.`)}resetPositions(e){this.ballX=this.width/2,this.ballY=this.height/2,this.ballDx=0,this.ballDy=0,this.paddle1y=this.centerPaddle(),this.paddle2y=this.centerPaddle(),this.awaitingServe=!0,this.statusEl.textContent=e}centerPaddle(){return Math.max((this.height-this.paddleLength)/2,0)}updateScoreboard(){this.scoreAEl.textContent=`A: ${this.scoreA}`,this.scoreBEl.textContent=`B: ${this.scoreB}`}drawFrame(){this.ctx.clearRect(0,0,this.width,this.height),this.drawCourt(),this.drawBall()}drawCourt(){this.ctx.fillStyle="rgb(35, 98, 243)",this.ctx.fillRect(0,0,this.width,this.height),this.drawLine(0,0,this.width,0),this.drawLine(0,0,0,this.height),this.drawLine(this.width,0,0,this.height),this.drawLine(0,this.height,this.width,0),this.drawLine(this.width/2,0,0,this.height,5),this.drawLine(this.paddle1x,this.paddle1y,0,this.paddleLength,this.paddleWidth),this.drawLine(this.paddle2x,this.paddle2y,0,this.paddleLength,this.paddleWidth)}drawLine(e,t,i,a,s=10){this.ctx.beginPath(),this.ctx.strokeStyle="white",this.ctx.lineWidth=s,this.ctx.moveTo(e,t),this.ctx.lineTo(e+i,t+a),this.ctx.stroke()}drawBall(){this.ctx.fillStyle="orange",this.ctx.beginPath(),this.ctx.arc(this.ballX,this.ballY,this.ballSize/2,0,Math.PI*2),this.ctx.fill()}}const ne=r=>{if(!T()){location.hash="/auth";return}const e=document.createElement("main");e.className="app game",e.innerHTML=`
    <header class="app__header">
      <div>
        <h1>Pong Prototipi</h1>
        <p>W/S ve ↑/↓ tuşlarıyla raketleri kontrol edebilirsin.</p>
      </div>
      <div class="game__controls">
        <div class="game__keys">
          <p><strong>Oyuncu A:</strong> W / S</p>
          <p><strong>Oyuncu B:</strong> ↑ / ↓</p>
        </div>
        <button class="button button--secondary" type="button" data-action="leave">Oyundan Çık</button>
      </div>
    </header>
    <section class="game__canvas-wrapper">
      <canvas></canvas>
      <div class="game__score">
        <span data-score="a">A: 0</span>
        <span data-score="b">B: 0</span>
      </div>
    </section>
    <section class="game__status" data-status>
      <p>Paddle'ları (W/S ve ↑/↓) hareket ettirerek oyunu başlat. İlk 10 puan alan kazanır.</p>
    </section>
  `,r.appendChild(e);const t=e.querySelector("canvas"),i=e.querySelector('[data-score="a"]'),a=e.querySelector('[data-score="b"]'),s=e.querySelector("[data-status]");if(!t||!i||!a||!s)throw new Error("Oyun bileşenleri oluşturulamadı.");const l=se(t,i,a,s),m=e.querySelector('[data-action="leave"]');return m==null||m.addEventListener("click",()=>{location.hash="/dashboard"}),()=>{l()}},ie=[2,4,8,16,32],oe=r=>{if(!r.bracket||r.bracket.rounds.length===0)return"<p>Bracket oluşturulduğunda burada görünecek.</p>";const[e]=r.bracket.rounds;return`
    <div class="bracket">
      ${e.matches.map(t=>`
          <div class="bracket__match">
            <p>Match #${t.match}</p>
            <div>
              <span>${t.playerA.alias}</span>
              <span>vs</span>
              <span>${t.playerB.alias}</span>
            </div>
          </div>
        `).join("")}
    </div>
  `},le=r=>{const e=T();if(!e){location.hash="/auth";return}const t=document.createElement("main");t.className="app tournament",t.innerHTML=`
    <header class="tournament__header">
      <div>
        <h1>Turnuvalar</h1>
        <p>Yeni turnuva oluştur veya mevcut turnuvalara katıl.</p>
      </div>
    </header>
    <section class="tournament__tabs">
      <button class="tab-button is-active" data-tab="create">Turnuva Oluştur</button>
      <button class="tab-button" data-tab="list">Aktif Turnuvalar</button>
    </section>
    <section class="tournament__content" data-tab-panel="create">
      <form class="tournament__form" data-form="create">
        <label>
          <span>Turnuva adı</span>
          <input type="text" name="name" placeholder="Örn. Akşam Ligi" required minlength="3" maxlength="64"/>
        </label>
        <label>
          <span>Maksimum oyuncu (2^x)</span>
          <select name="maxPlayers">
            ${ie.map(h=>`<option value="${h}">${h} oyuncu</option>`).join("")}
          </select>
        </label>
        <button class="button" type="submit">Turnuvayı Oluştur</button>
        <p class="status" data-status="create"></p>
      </form>
    </section>
    <section class="tournament__content is-hidden" data-tab-panel="list">
      <div data-list></div>
      <p class="status" data-status="list"></p>
    </section>
  `,r.appendChild(t);const i=h=>{t.querySelectorAll(".tab-button").forEach(d=>d.classList.toggle("is-active",d.dataset.tab===h)),t.querySelectorAll("[data-tab-panel]").forEach(d=>d.classList.toggle("is-hidden",d.dataset.tabPanel!==h))};t.querySelectorAll(".tab-button").forEach(h=>{h.addEventListener("click",()=>{i(h.dataset.tab==="list"?"list":"create"),h.dataset.tab==="list"&&m()})});const a=t.querySelector('[data-status="create"]'),s=t.querySelector('[data-status="list"]'),l=t.querySelector("[data-list]"),m=async()=>{s.textContent="Turnuvalar yükleniyor...";try{const h=await fetch("/api/tournaments",{credentials:"include"});if(!h.ok){h.status===401&&(location.hash="/auth"),s.textContent="Turnuvalar alınamadı.";return}const d=await h.json();if(s.textContent="",!d.length){l.innerHTML="<p>Aktif turnuva yok.</p>";return}l.innerHTML=d.map(n=>`
            <article class="tournament-card ${n.status==="active"?"is-active":""}">
              <header>
                <div>
                  <p class="tournament-card__status">${n.status==="active"?"Başladı":"Beklemede"}</p>
                  <h3>${n.name}</h3>
                  <p class="tournament-card__meta">Sahip: ${n.ownerNickname??"Bilinmiyor"}</p>
                </div>
                <div class="tournament-card__badge">${n.currentPlayers}/${n.maxPlayers}</div>
              </header>
              <div class="tournament-card__body">
                ${n.status==="pending"?`
                      <form data-join="${n.id}" class="tournament-card__join">
                        <button class="button" type="submit">Takma adım ile katıl</button>
                      </form>
                      ${n.ownerId===e.id?`<button class="button button--secondary" data-action="start" data-id="${n.id}">Turnuvayı Başlat</button>`:""}
                    `:oe(n)}
              </div>
            </article>
          `).join(""),l.querySelectorAll("[data-join]").forEach(n=>{n.addEventListener("submit",u=>{u.preventDefault();const y=Number(n.dataset.join);b(y)})}),l.querySelectorAll('[data-action="start"]').forEach(n=>{n.addEventListener("click",()=>{const u=Number(n.dataset.id);f(u)})})}catch(h){console.warn("Turnuvalar alınamadı:",h),s.textContent="Turnuvalar alınamadı."}},b=async h=>{s.textContent="Katılım gönderiliyor...";try{const d=await fetch(`/api/tournaments/${h}/join`,{method:"POST",credentials:"include"});if(!d.ok){const n=await d.json().catch(()=>null);s.textContent=(n==null?void 0:n.message)??"Katılım başarısız oldu.";return}s.textContent="Turnuvaya katıldın!",await m()}catch(d){console.warn("Katılım hatası:",d),s.textContent="Katılım sırasında hata oluştu."}},f=async h=>{s.textContent="Turnuva başlatılıyor...";try{const d=await fetch(`/api/tournaments/${h}/start`,{method:"POST",credentials:"include"});if(!d.ok){const n=await d.json().catch(()=>null);s.textContent=(n==null?void 0:n.message)??"Turnuva başlatılamadı.";return}s.textContent="Turnuva başlatıldı!",await m()}catch(d){console.warn("Başlatma hatası:",d),s.textContent="Turnuva başlatılırken hata oluştu."}},p=t.querySelector('[data-form="create"]');p==null||p.addEventListener("submit",async h=>{if(h.preventDefault(),!p.checkValidity()){p.reportValidity();return}a.textContent="Turnuva oluşturuluyor...";const d=new FormData(p);try{const n=await fetch("/api/tournaments",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({name:d.get("name"),maxPlayers:Number(d.get("maxPlayers"))})});if(!n.ok){const u=await n.json().catch(()=>null);a.textContent=(u==null?void 0:u.message)??"Turnuva oluşturulamadı.";return}a.textContent="Turnuva oluşturuldu!",p.reset(),i("list"),await m()}catch(n){console.warn("Turnuva oluşturma hatası:",n),a.textContent="Turnuva oluşturulamadı."}}),m()},D=document.getElementById("app");if(!D)throw new Error("Uygulama için kök element bulunamadı.");const _=new j(D);_.register({path:"/auth",render:J});_.register({path:"/dashboard",render:Z});_.register({path:"/game",render:ne});_.register({path:"/tournament",render:le});_.init();
