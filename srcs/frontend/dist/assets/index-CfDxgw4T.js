(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();class G{constructor(e){this.routes=new Map,this.target=e,window.addEventListener("hashchange",()=>this.handleRoute())}register(e){this.routes.set(e.path,e.render)}init(){if(!location.hash){this.navigate("/auth",{replace:!0});return}this.handleRoute()}navigate(e,t){t!=null&&t.replace?(history.replaceState(null,"",`#${e}`),this.handleRoute()):location.hash=e}handleRoute(){const e=location.hash.replace(/^#/,"")||"/auth",[t]=e.split("?"),r=t||"/auth",s=this.routes.get(r);if(s){this.currentCleanup&&(this.currentCleanup(),this.currentCleanup=void 0),this.target.innerHTML="";const i=s(this.target);typeof i=="function"&&(this.currentCleanup=i)}}}const _="transcendence_user",O=a=>{localStorage.setItem(_,JSON.stringify(a))},$=()=>{const a=localStorage.getItem(_);if(!a)return null;try{return JSON.parse(a)}catch{return k(),null}},k=()=>{localStorage.removeItem(_)},C=a=>typeof a=="string"?a:"",E=(a,e,t,r,s)=>{const i=[s!=null&&s.minlength?`minlength="${s.minlength}"`:"",s!=null&&s.maxlength?`maxlength="${s.maxlength}"`:""].filter(Boolean).join(" ");let n=s==null?void 0:s.autocomplete;return n||(e==="email"?n="email":e==="password"?n="current-password":e==="nickname"&&(n="username")),`
    <label class="flex flex-col gap-3">
      <span class="text-sm font-bold text-slate-800 tracking-wide">${a}</span>
      <input 
        type="${t}" 
        name="${e}" 
        required 
        ${i} 
        placeholder="${r}"
        ${n?`autocomplete="${n}"`:""}
        class="w-full px-5 py-4 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 shadow-sm hover:shadow-md hover:border-slate-300"
      />
      <small data-feedback-for="${e}" class="text-xs text-red-600 mt-1 min-h-[16px] font-medium"></small>
    </label>
  `},R=[{formId:"manual-register-form",title:"Manuel Kayıt",buttonLabel:"Kaydı Gönder",renderFields:()=>`
      ${E("E-posta","email","email","ornek@mail.com")}
      ${E("Kullanıcı adı","nickname","text","nickname",{minlength:3,maxlength:48})}
      ${E("Şifre","password","password","En az 8 karakter",{minlength:8,autocomplete:"new-password"})}
    `},{formId:"manual-login-form",title:"Manuel Giriş",buttonLabel:"Giriş Yap",renderFields:()=>`
      ${E("E-posta","email","email","ornek@mail.com")}
      ${E("Şifre","password","password","Şifren",{autocomplete:"current-password"})}
    `}],D=a=>{const e=Number(a.id),t=a.email,r=a.nickname,s=a.provider;return Number.isNaN(e)||typeof t!="string"||typeof r!="string"||s!=="local"&&s!=="google"?null:{id:e,email:t,nickname:r,provider:s}},F=a=>[{formId:"manual-register-form",endpoint:"/api/users/register",buildPayload:e=>({email:C(e.get("email")),nickname:C(e.get("nickname")),password:C(e.get("password"))}),successMessage:e=>`Kayıt tamamlandı: ${e.nickname??"kullanıcı"} (id: ${e.id}).`},{formId:"manual-login-form",endpoint:"/api/users/login",buildPayload:e=>({email:C(e.get("email")),password:C(e.get("password"))}),successMessage:()=>"Giriş başarılı. Oturum cookie üzerinde saklandı.",onSuccess:e=>{const t=D(e);t&&(O(t),a())}}],M=(a,e,t,r="")=>{const s=a.querySelector(`.status[data-status-for="${e}"]`);if(s){if(s.classList.remove("bg-green-50","text-green-800","border-green-200","bg-red-50","text-red-800","border-red-200","bg-blue-50","text-blue-800","border-blue-200","hidden"),t==="loading"){s.innerHTML=`
      <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>İstek gönderiliyor...</span>
    `,s.classList.add("bg-blue-50","text-blue-800","border-blue-300"),s.style.display="flex",s.classList.remove("hidden");return}if(!r){s.innerHTML="",s.classList.add("hidden"),s.style.display="none";return}s.style.display="flex",s.classList.remove("hidden"),t==="success"?(s.innerHTML=`
      <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="font-bold">${r}</span>
    `,s.classList.add("bg-green-100","text-green-900","border-green-400","shadow-lg")):t==="error"&&(s.innerHTML=`
      <svg class="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="font-bold">${r}</span>
    `,s.classList.add("bg-red-100","text-red-900","border-red-400","shadow-lg"))}},U=async()=>{try{const a=await fetch("/api/users/refresh",{method:"POST",credentials:"include"});if(!a.ok)return!1;const e=a.headers.get("content-type");if(e&&e.includes("application/json"))try{const t=await a.json();return O(t),!0}catch{return!1}else return!1}catch(a){return console.warn("Oturum yenilemesi sırasında hata oluştu:",a),!1}},V=async a=>{try{const e=await fetch("/api/users/me",{credentials:"include"});if(e.ok){const t=e.headers.get("content-type");if(t&&t.includes("application/json"))try{const r=await e.json();O(r)}catch{k()}else k()}else e.status===401&&await U()||k()}catch{}finally{a()}},W=()=>{const a=window.location.hash;if(!a.includes("?"))return null;const[e,t]=a.split("?"),r=new URLSearchParams(t),s=r.get("oauth");if(!s)return null;r.delete("oauth");const i=r.toString(),n=i?`${e}?${i}`:e||"#/auth";return history.replaceState(null,"",n),s},J={success:{type:"success",message:"Google ile giriş tamamlandı."},denied:{type:"error",message:"Google yetkilendirmesi iptal edildi."},missing_params:{type:"error",message:"Google dönüşünde gerekli parametreler eksikti."},state_mismatch:{type:"error",message:"Oturum doğrulaması zaman aşımına uğradı, lütfen tekrar deneyin."},token_error:{type:"error",message:"Google token alınırken hata oluştu."},profile_error:{type:"error",message:"Google profil bilgileri okunamadı."},email_unverified:{type:"error",message:"Google hesabınız doğrulanmamış bir e-posta içeriyor."},email_conflict:{type:"error",message:"Bu e-posta zaten manuel kayıtla kullanıldığı için Google ile bağlanamadı."},internal_error:{type:"error",message:"Google OAuth akışında beklenmeyen bir hata oluştu."}},Y=()=>{const a=W(),e=document.createElement("main");e.className="min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",e.innerHTML=`
    <header class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center">
          <h1 class="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
            Transcendence
          </h1>
        </div>
      </div>
    </header>
  `;const t=document.createElement("section");t.className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto items-start mt-16 lg:mt-24 pb-16";const r=document.createElement("div");r.className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[260px] lg:sticky lg:top-24";const s=document.createElement("div");s.className="flex-1 w-full min-w-0",t.append(r,s),e.appendChild(t),R.forEach((d,p)=>{const y=document.createElement("section"),A=d.formId==="manual-register-form";y.className="form-section rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10",y.dataset.section=d.formId,A?y.style.display="block":y.style.display="none",y.innerHTML=`
      <div class="mb-8">
        <h2 class="text-3xl font-extrabold text-slate-900 mb-2">${d.title}</h2>
        <div class="h-1 w-20 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full"></div>
      </div>
      <form id="${d.formId}" class="flex flex-col gap-6">
        ${d.renderFields()}
        <button type="submit" class="w-full px-6 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform">
          ${d.buttonLabel}
        </button>
      </form>
      <div class="status mt-6 p-5 rounded-xl text-base font-semibold flex items-center gap-3 border-2 hidden min-h-[60px]" data-status-for="${d.formId}"></div>
    `,s.appendChild(y)});const i=e.querySelector("header"),n=document.createElement("div");n.className="hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4",i==null||i.insertAdjacentElement("afterend",n),(d=>{if(!d){n.classList.add("hidden"),n.innerHTML="",n.classList.remove("bg-green-50","text-green-800","border-green-200","bg-red-50","text-red-800","border-red-200");return}const p=J[d]??{type:"error",message:"Google OAuth akışı tamamlanamadı."};n.classList.remove("bg-green-50","text-green-800","border-green-200","bg-red-50","text-red-800","border-red-200","hidden"),n.innerHTML=`
      <div class="rounded-2xl border-2 p-5 backdrop-blur-xl shadow-2xl ${p.type==="success"?"bg-green-500/20 text-green-100 border-green-400/30 ring-2 ring-green-500/20":"bg-red-500/20 text-red-100 border-red-400/30 ring-2 ring-red-500/20"}">
        <div class="flex items-center">
          ${p.type==="success"?'<svg class="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>':'<svg class="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>'}
          <span class="font-bold text-base">${p.message}</span>
        </div>
      </div>
    `})(a),Array.from(s.querySelectorAll(".form-section"));const h=`
    <span class="flex-shrink-0 mr-2" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" role="img">
        <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-2 3l3.2 2.5c1.9-1.8 3-4.5 3-7.5 0-.7-.1-1.3-.2-1.9H12z"/>
        <path fill="#34A853" d="M5.3 14.3 4.4 15.7 1.4 17.8C3.4 21.2 7.4 24 12 24c3 0 5.5-1 7.3-2.7l-3.2-2.5c-.9.6-2 1-3.1 1-2.4 0-4.5-1.6-5.2-3.8z"/>
        <path fill="#4A90E2" d="M1.4 6.2C.5 7.9 0 9.9 0 12s.5 4.1 1.4 5.8l3.9-3c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2z"/>
        <path fill="#FBBC05" d="M12 4.8c1.6 0 3 .6 4 1.6l3-3C17.5 1.3 15 0 12 0 7.4 0 3.4 2.8 1.4 6.2l3.9 3.1c.7-2.2 2.8-3.8 5.2-3.8z"/>
      </svg>
    </span>
  `,u=[{id:"manual-register-form",label:"Kayıt Ol",type:"form"},{id:"manual-login-form",label:"Giriş Yap",type:"form"},{id:"google",label:"Google ile Devam Et",type:"google"}],g=d=>{Array.from(s.querySelectorAll(".form-section")).forEach(y=>{y.dataset.section===d?(y.style.display="block",y.classList.remove("hidden")):(y.style.display="none",y.classList.add("hidden"))})},f=d=>{r.querySelectorAll("button[data-target]").forEach(p=>{const y=p.dataset.target===d;p.dataset.target!=="google"&&(y?(p.classList.remove("bg-slate-100","text-slate-700","hover:bg-slate-200"),p.classList.add("bg-gradient-to-r","from-sky-500","to-indigo-600","text-white")):(p.classList.remove("bg-gradient-to-r","from-sky-500","to-indigo-600","text-white","shadow-lg","shadow-sky-500/50"),p.classList.add("bg-white/10","text-slate-300","hover:bg-white/20","backdrop-blur-sm","border-white/20")))})};u.forEach(d=>{const p=document.createElement("button");p.type="button",p.dataset.target=d.id;const y="px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 w-full border-2";d.type==="google"?(p.className=`${y} bg-white/95 backdrop-blur-sm text-slate-800 border-white/30 hover:bg-white hover:border-white/50 hover:shadow-lg hover:scale-[1.02] transform`,p.innerHTML=`${h}<span>${d.label}</span>`):(p.className=`${y} bg-white/10 text-slate-300 hover:bg-white/20 backdrop-blur-sm border-white/20 hover:scale-[1.02] transform`,p.innerHTML=`<span>${d.label}</span>`),p.addEventListener("click",()=>{if(d.type==="google"){window.location.href="/api/users/oauth/google/start";return}f(d.id),g(d.id)}),r.appendChild(p)}),f("manual-register-form"),g("manual-register-form");const b=document.createElement("section");b.className="hidden max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24",b.innerHTML=`
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
  `,e.appendChild(b);const c=b.querySelector("button");c&&c.addEventListener("click",()=>{location.hash="/game"});const o=()=>{!!$()?(t.classList.add("hidden"),b.classList.remove("hidden")):(t.classList.remove("hidden"),b.classList.add("hidden"))},l=()=>{const d=!!$(),p=location.hash.replace("#","");d&&p==="/auth"?location.hash="/dashboard":!d&&p!=="/auth"&&(location.hash="/auth")};o(),l();const x=()=>{o(),l()};return F(x).forEach(d=>{const p=e.querySelector(`#${d.formId}`);p&&(X(p),p.addEventListener("submit",async y=>{var j,B;y.preventDefault();const A=new FormData(p);if(!p.checkValidity()){p.reportValidity();return}M(e,d.formId,"loading");try{const T=await fetch(d.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(d.buildPayload(A))}),v=await T.clone().json().catch(()=>{});if(!T.ok){const w=await T.clone().text().catch(()=>"İstek başarısız oldu."),K=(v==null?void 0:v.message)??(w.startsWith("<")?"İstek başarısız oldu.":w);M(e,d.formId,"error",K);return}v?((j=d.onSuccess)==null||j.call(d,v),M(e,d.formId,"success",d.successMessage(v)),setTimeout(()=>{const w=e.querySelector(`.status[data-status-for="${d.formId}"]`);w&&(w.classList.add("hidden"),w.style.display="none")},1e4)):((B=d.onSuccess)==null||B.call(d,{}),M(e,d.formId,"success",d.successMessage({})),setTimeout(()=>{const w=e.querySelector(`.status[data-status-for="${d.formId}"]`);w&&(w.classList.add("hidden"),w.style.display="none")},1e4)),p.reset()}catch(T){const v=T instanceof Error?T.message:"Beklenmeyen bir hata oluştu.";M(e,d.formId,"error",v)}}))}),V(x),e},X=a=>{Array.from(a.querySelectorAll("input[name]")).forEach(t=>{const r=a.querySelector(`[data-feedback-for="${t.name}"]`);if(!r)return;const s=()=>{if(t.validity.valid){r.textContent="",t.classList.remove("border-red-500","ring-red-500"),t.classList.add("border-slate-300");return}let i="";t.validity.valueMissing?i="Bu alan zorunlu.":t.validity.typeMismatch&&t.type==="email"?i="Lütfen geçerli bir e-posta gir.":t.validity.tooShort?i=`En az ${t.minLength} karakter olmalı.`:t.validity.tooLong?i=`En fazla ${t.maxLength} karakter olabilir.`:t.validity.patternMismatch&&(i="Girdi beklenen formata uymuyor."),r.textContent=i,i&&(t.classList.remove("border-slate-300","ring-sky-500"),t.classList.add("border-red-500","ring-red-500"))};t.addEventListener("input",s),t.addEventListener("blur",s)})},Q=a=>{const e=Y();a.appendChild(e)},I=a=>a.replace(/[&<>'"]/g,e=>{switch(e){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";case"'":return"&#39;";default:return e}}),Z=a=>{const e=new Date(a);return Number.isNaN(e.getTime())?"-":e.toLocaleString()},ee=a=>`
  <header class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div class="flex-1">
          <p class="uppercase text-xs tracking-wider text-slate-400 mb-3 font-bold">Profil</p>
          <h1 class="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight pb-2 leading-tight" data-profile-field="nickname">${I(a)}</h1>
        </div>
        <div class="flex gap-3 flex-wrap justify-end w-full sm:w-auto">
          <button class="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white transition-all duration-300 hover:from-sky-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-sky-500/50 hover:scale-105 transform" type="button" data-action="play">Play Now</button>
          <button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-sky-400 border-2 border-sky-500/30 transition-all duration-300 hover:bg-sky-500/20 hover:border-sky-500/50 hover:text-sky-300 hover:scale-105 transform" type="button" data-action="tournaments">Turnuvalar</button>
          <button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-red-400 border-2 border-red-500/30 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 hover:scale-105 transform" type="button" data-action="logout">Çıkış</button>
        </div>
      </div>
    </div>
  </header>
`,te=a=>`
  <section class="rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10 mb-8">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-600 after:rounded-full">Hesap Özeti</h2>
    <dl class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-start gap-2 pb-6 border-b border-slate-200 last:border-b-0">
        <dt class="text-sm font-bold text-slate-600 uppercase tracking-wider min-w-[140px]">Kullanıcı ID</dt>
        <dd class="text-slate-900 font-semibold text-lg" data-profile-field="id">#${a.id}</dd>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-start gap-2 pb-6 border-b border-slate-200 last:border-b-0">
        <dt class="text-sm font-bold text-slate-600 uppercase tracking-wider min-w-[140px]">Takma Ad</dt>
        <dd class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-slate-900 font-semibold text-lg" data-profile-field="nicknameInline">${I(a.nickname)}</span>
            <button class="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 transition-colors duration-200" type="button" data-action="edit-nickname" aria-label="Takma adı düzenle">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          </div>
          <form class="hidden flex flex-col gap-3" data-nickname-form>
            <input type="text" name="nickname" data-nickname-input value="${I(a.nickname)}" minlength="3" maxlength="48" required class="rounded-xl border-2 border-slate-300 bg-white/50 backdrop-blur-sm px-5 py-4 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all duration-200"/>
            <div class="flex gap-3">
              <button class="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform" type="submit">Kaydet</button>
              <button class="px-6 py-2.5 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-slate-600 border-2 border-slate-300 hover:bg-slate-100 transition-all duration-300 hover:scale-105 transform" type="button" data-action="cancel-nickname">Vazgeç</button>
            </div>
            <p class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mt-2 min-h-[48px] hidden" data-status="nickname"></p>
          </form>
        </dd>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-start gap-2 pb-6 border-b border-slate-200 last:border-b-0">
        <dt class="text-sm font-bold text-slate-600 uppercase tracking-wider min-w-[140px]">Giriş Provider</dt>
        <dd class="text-slate-900 font-semibold text-lg" data-profile-field="providerLabel">${a.provider==="google"?"Google OAuth":"Local (manuel)"}</dd>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-start gap-2 pb-6 border-b border-slate-200 last:border-b-0">
        <dt class="text-sm font-bold text-slate-600 uppercase tracking-wider min-w-[140px]">Katılım Tarihi</dt>
        <dd class="text-slate-900 font-semibold text-lg" data-profile-field="createdAt">-</dd>
      </div>
    </dl>
  </section>
`,se=()=>`
  <section class="rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-600 after:rounded-full">Turnuva / Oyun Durumu</h2>
    <p class="text-slate-600 text-lg leading-relaxed">Turnuva sistemi bu alanda listelenecek. Şimdilik Play Now ile Pong'a geçebilirsin.</p>
  </section>
`,ae=a=>{let e=$();if(!e){location.hash="/auth";return}a.className="",a.style.cssText="";const t=document.createElement("main");t.className="min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",t.innerHTML=`
    ${ee(e.nickname)}
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      ${te(e)}
      ${se()}
    </div>
  `,a.appendChild(t);const r=o=>{if(!e)return;e={id:o.id,email:o.email,nickname:o.nickname,provider:o.provider},O(e);const l=(x,S)=>{const d=t.querySelector(x);d&&(d.textContent=S)};l('[data-profile-field="nickname"]',o.nickname),l('[data-profile-field="id"]',`#${o.id}`),l('[data-profile-field="nicknameInline"]',o.nickname),l('[data-profile-field="providerLabel"]',o.provider==="google"?"Google OAuth":"Local (manuel)"),l('[data-profile-field="createdAt"]',Z(o.createdAt))};fetch("/api/users/profile",{credentials:"include"}).then(async o=>{if(!o.ok){o.status===401&&(k(),location.hash="/auth");return}const l=await o.json();r(l)}).catch(o=>{console.warn("Profil bilgisi alınamadı:",o)});const s=t.querySelector('[data-action="play"]');s==null||s.addEventListener("click",()=>{location.hash="/game"});const i=t.querySelector('[data-action="tournaments"]');i==null||i.addEventListener("click",()=>{location.hash="/tournament"});const n=t.querySelector('[data-action="logout"]');n==null||n.addEventListener("click",async()=>{const o=()=>{location.hash!=="#/auth"&&location.replace(`${location.origin}/#/auth`)};o();try{await fetch("/api/users/logout",{method:"POST",credentials:"include"})}catch(l){console.warn("Logout isteği başarısız oldu:",l)}finally{k(),o()}});const m=t.querySelector("[data-nickname-form]"),h=t.querySelector("[data-nickname-input]"),u=t.querySelector('[data-status="nickname"]'),g=t.querySelector('[data-action="edit-nickname"]'),f=t.querySelector('[data-action="cancel-nickname"]'),b=(o,l="")=>{if(u)if(u.classList.remove("bg-green-100","text-green-900","border-green-400","bg-red-100","text-red-900","border-red-400","bg-blue-100","text-blue-900","border-blue-400","hidden","shadow-lg","border-2"),u.innerHTML="",u.style.display="flex",u.classList.remove("hidden"),o==="loading")u.innerHTML=`
        <svg class="animate-spin h-5 w-5 text-blue-600 flex-shrink-0" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="font-semibold">${l||"Kaydediliyor..."}</span>
      `,u.classList.add("bg-blue-100","text-blue-900","border-blue-400","border-2");else if(l)o==="success"?(u.innerHTML=`
        <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-bold">${l}</span>
      `,u.classList.add("bg-green-100","text-green-900","border-green-400","border-2","shadow-lg"),setTimeout(()=>{u.classList.add("hidden"),u.style.display="none",u.textContent=""},5e3)):o==="error"&&(u.innerHTML=`
        <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-bold">${l}</span>
      `,u.classList.add("bg-red-100","text-red-900","border-red-400","border-2","shadow-lg"));else{u.textContent="",u.classList.add("hidden"),u.style.display="none";return}},c=o=>{m&&(o?(m.classList.remove("hidden"),m.classList.add("flex")):(m.classList.add("hidden"),m.classList.remove("flex"))),g&&(o?g.classList.add("hidden"):g.classList.remove("hidden")),o?(h==null||h.focus(),h==null||h.select()):u&&b("error","")};g==null||g.addEventListener("click",()=>{h&&e&&(h.value=e.nickname),c(!0)}),f==null||f.addEventListener("click",()=>{c(!1)}),m==null||m.addEventListener("submit",async o=>{if(o.preventDefault(),!h)return;const l=h.value.trim();if(l.length<3||l.length>48){b("error","Takma ad 3-48 karakter arası olmalı.");return}b("loading","Kaydediliyor...");try{const x=await fetch("/api/users/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({nickname:l})});if(!x.ok){const d=await x.json().catch(()=>null);b("error",(d==null?void 0:d.message)??"Güncelleme başarısız oldu.");return}const S=await x.json();r(S),b("success","Güncellendi."),c(!1)}catch(x){console.warn("Takma ad güncellenemedi:",x),b("error","Beklenmeyen bir hata oluştu.")}})},re=1.79672131148,ie=()=>`${location.protocol==="https:"?"wss":"ws"}://${location.host}/ws/game`,q=a=>{a.height=window.innerHeight*.6,a.width=a.height*re};class oe{constructor(e,t,r,s,i){this.canvas=e,this.scoreAEl=t,this.scoreBEl=r,this.controls=s,this.user=i,this.ws=null,this.state=null,this.animationId=null,this.pressedKeys=new Set,this.playerIndex=null,this.roomCode=null,this.attachInputHandlers(),q(e),this.handleResize=()=>q(e),window.addEventListener("resize",this.handleResize)}setStatus(e){this.controls.statusEl.textContent=e}stopAnimation(){this.animationId!==null&&(cancelAnimationFrame(this.animationId),this.animationId=null)}startAnimation(){if(this.animationId!==null)return;const e=this.canvas.getContext("2d");if(!e)return;const t=(s,i,n,m,h)=>{e.beginPath(),e.strokeStyle="black",e.lineWidth=h,e.moveTo(s,i),e.lineTo(s+n,i+m),e.stroke()},r=()=>{if(this.state){const{state:s}=this,i=this.canvas.width/s.width,n=this.canvas.height/s.height;e.fillStyle="#7dd3fc",e.fillRect(0,0,this.canvas.width,this.canvas.height);const m=s.lineWidth*i;t(0,0,this.canvas.width,0,m),t(0,0,0,this.canvas.height,m),t(this.canvas.width,0,0,this.canvas.height,m),t(0,this.canvas.height,this.canvas.width,0,m),t(this.canvas.width/2,0,0,this.canvas.height,m/2),e.fillStyle="black",s.players.forEach((h,u)=>{const g=u===0?s.paddleGap*i:this.canvas.width-s.paddleGap*i-s.paddleWidth*i,f=h.y*n;e.fillRect(g,f,s.paddleWidth*i,s.paddleHeight*n)}),e.fillStyle="orange",e.beginPath(),e.arc(s.ball.x*i,s.ball.y*n,s.ball.radius/2*i,0,Math.PI*2),e.fill()}this.animationId=requestAnimationFrame(r)};this.animationId=requestAnimationFrame(r)}attachInputHandlers(){const e=r=>{(r.key==="ArrowUp"||r.key==="ArrowDown")&&r.preventDefault(),this.pressedKeys.add(r.key),this.pushInput()},t=r=>{this.pressedKeys.delete(r.key),this.pushInput()};document.addEventListener("keydown",e),document.addEventListener("keyup",t),this.cleanupInput=()=>{document.removeEventListener("keydown",e),document.removeEventListener("keyup",t)}}pushInput(){if(!this.ws||this.ws.readyState!==WebSocket.OPEN||this.playerIndex===null)return;let e=0;const t=this.playerIndex===0?["w","W"]:["ArrowUp"],r=this.playerIndex===0?["s","S"]:["ArrowDown"];t.some(s=>this.pressedKeys.has(s))&&(e=-1),r.some(s=>this.pressedKeys.has(s))&&(e=1),this.ws.send(JSON.stringify({type:"input",dir:e}))}updateScores(){var e,t;this.state&&(this.scoreAEl.textContent=`A: ${((e=this.state.players[0])==null?void 0:e.score)??0}`,this.scoreBEl.textContent=`B: ${((t=this.state.players[1])==null?void 0:t.score)??0}`)}handleMessage(e){let t=null;try{t=JSON.parse(e.data)}catch{return}t.type==="room_joined"?(this.playerIndex=t.playerIndex,this.roomCode=t.roomCode,this.setStatus(`Oda: ${t.roomCode} | Sen: Oyuncu ${t.playerIndex===0?"A":"B"}`)):t.type==="state"?(this.state=t.state,this.updateScores(),this.startAnimation()):t.type==="error"?this.setStatus(t.message):t.type==="opponent_left"&&this.setStatus("Rakip ayrıldı, oda kapatıldı.")}connect(e,t){this.ws&&this.ws.close(),this.playerIndex=null,this.roomCode=null,this.state=null,this.stopAnimation();const r=`${ie()}?nickname=${encodeURIComponent(this.user.nickname)}`;this.ws=new WebSocket(r),this.ws.addEventListener("message",s=>this.handleMessage(s)),this.ws.addEventListener("open",()=>{var s,i;e==="create"?((s=this.ws)==null||s.send(JSON.stringify({type:"create_room",nickname:this.user.nickname})),this.setStatus("Oda oluşturuluyor...")):e==="join"&&t&&((i=this.ws)==null||i.send(JSON.stringify({type:"join_room",roomCode:t,nickname:this.user.nickname})),this.setStatus(`Odaya bağlanılıyor (${t})...`))}),this.ws.addEventListener("close",()=>{this.setStatus("Bağlantı kapandı.")})}createRoom(){this.connect("create")}joinRoom(e){const t=e.trim().toUpperCase();if(!t){this.setStatus("Oda kodu gerekli.");return}this.connect("join",t)}destroy(){var e,t;(e=this.ws)==null||e.close(),this.stopAnimation(),(t=this.cleanupInput)==null||t.call(this),window.removeEventListener("resize",this.handleResize)}}const le=(a,e,t,r,s)=>{const i=new oe(a,e,t,r,s);return r.createButton.addEventListener("click",()=>i.createRoom()),r.joinButton.addEventListener("click",()=>i.joinRoom(r.roomInput.value)),r.statusEl.textContent="Oda oluştur veya katıl.",()=>i.destroy()};class z{constructor({canvas:e,ctx:t,x:r,y:s,height:i,width:n,speed:m,score:h=0}){this.canvas=e,this.ctx=t,this.x=r,this.y=s,this.height=i,this.width=n,this.speed=m,this.score=h,this.start_y=this.y}update(e,t){this.y+=e*t}goal(){this.score+=1}draw(){this.ctx.fillStyle="black",this.ctx.fillRect(this.x,this.y,this.width,this.height)}reset(){this.y=this.start_y}}class ne{constructor(e,t,r,s,i,n,m=-1,h=0){this.canvas=e,this.ctx=t,this.x=r,this.y=s,this.speed=i,this.radius=n,this.dx=m,this.dy=h,this.start_y=this.y,this.start_x=this.x,this.start_dx=this.dx,this.start_dy=this.dy,this.start_speed=this.speed}draw(){this.ctx.fillStyle="orange",this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.radius/2,0,Math.PI*2),this.ctx.fill()}update(){this.x+=this.dx*this.speed,this.y+=this.dy*this.speed}reset(){this.x=this.start_x,this.y=this.start_y,this.dx=this.start_dx,this.dy=this.start_dy,this.speed=this.start_speed}}class de{constructor(e,t,r,s=null,i=null){this.animationFrameId=null,this.scoreAEl=s,this.scoreBEl=i,this.ctx=e,this.height=t.height,this.width=t.width,this.rect=t.getBoundingClientRect(),this.pressedKeys=r,this.active=0;let n=this.height/50.8,m=this.width*2/17.96,h=this.width/46,u=this.width/92;this.line_width=this.width/92,console.log(this.height/10),this.players=[new z({canvas:t,ctx:this.ctx,x:h,y:n,height:m,width:n,speed:u}),new z({canvas:t,ctx:this.ctx,x:this.width-h-n,y:this.height-n,height:m,width:n,speed:u})],this.ball=new ne(t,this.ctx,this.width/2,this.height/2,this.width/90,this.width*2/90),this.active=0,this.lastAIMoveTime=0,this.target=0,this.random_part=.5}find_target(e){let t=this.height/2;if(this.ball.dx<0)return t;let r=this.ball.dy*(e-this.ball.x)/this.ball.dx,s=this.ball.y,i;for(;r!=0;)r>0?i=Math.min(r,this.height-s):i=Math.max(r,-s),r-=i,s+=i,r*=-1;return s}loop(){this.ctx.fillStyle="#7dd3fc",this.ctx.fillRect(0,0,this.width,this.height),this.draw(this.line_width),this.ball.draw();const e=Date.now();e-this.lastAIMoveTime>=1e3&&(this.target=this.find_target(this.players[1].x),this.random_part=Math.random(),this.lastAIMoveTime=e),this.play_ai(this.players[1],this.target,this.random_part),this.players[0].draw(),this.players[1].draw(),this.pressedKeys.has("ArrowUp")&&(this.players[1].y+=this.update_player(this.players[1],-1),this.active=1),this.pressedKeys.has("ArrowDown")&&(this.players[1].y+=this.update_player(this.players[1],1),this.active=1),this.pressedKeys.has("w")&&(this.players[0].y+=this.update_player(this.players[0],-1),this.active=1),this.pressedKeys.has("s")&&(this.players[0].y+=this.update_player(this.players[0],1),this.active=1),this.active&&this.ball.update(),this.check_areas(),this.animationFrameId=requestAnimationFrame(()=>this.loop())}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}draw_line(e,t,r,s,i=10){this.ctx.beginPath(),this.ctx.strokeStyle="black",this.ctx.lineWidth=i,this.ctx.moveTo(e,t),this.ctx.lineTo(e+r,t+s),this.ctx.stroke()}draw(e){this.draw_line(0,0,this.width,0,e),this.draw_line(0,0,0,this.height,e),this.draw_line(this.width,0,0,this.height,e),this.draw_line(0,this.height,this.width,0,e),this.draw_line(this.width/2,0,0,this.height,e/2)}update_player(e,t){return t>0?Math.min(t*e.speed,this.height-e.height-e.y):Math.max(t*e.speed,-e.y)}goal(e){e==0?this.players[0].goal():this.players[1].goal(),this.scoreAEl&&(this.scoreAEl.textContent="A: "+this.players[0].score),this.scoreBEl&&(this.scoreBEl.textContent="B: "+this.players[1].score),this.ball.reset(),this.active=0}check_areas(){(this.ball.dy<0&&this.ball.y<this.line_width||this.ball.dy>0&&this.height-this.ball.y<this.line_width)&&(this.ball.dy*=-1),this.line_width/2>this.ball.x&&this.goal(1),this.width-this.ball.x<this.line_width/2&&this.goal(0),this.ball.dx<0&&this.ball.x-this.ball.radius<=this.players[0].x+this.players[0].width&&this.player_ball_collision(this.players[0],this.ball),this.ball.dx>0&&this.ball.x+this.ball.radius>=this.players[1].x&&this.player_ball_collision(this.players[1],this.ball)}player_ball_collision(e,t){if(!(e.y>t.y))if(e.y+e.height>t.y){let s=(t.y-(e.y+e.height/2))/(e.height/2)*(Math.PI/4);t.dx=Math.cos(s)*(-Math.abs(t.dx)/t.dx),t.dy=Math.sin(s),t.speed*=1.05}else e.y+e.height+t.radius/2>t.y}play_ai(e,t,r){if(e.y+e.height*((1-r)/2+r)>=t&&t>=e.y+e.height*((1-r)/2))return;let s=1;e.y+e.height/2>t&&(s=-1),e.y+=this.update_player(e,s)}}const ce=1.79672131148,he=(a,e,t,r)=>{const s=new Set,i=a.getContext("2d");if(!i)throw new Error("Could not get 2d context");const n=()=>{a.height=window.innerHeight*.6,a.width=a.height*ce};n();const m=()=>{n()};window.addEventListener("resize",m),e&&(e.textContent="A: 0"),t&&(t.textContent="B: 0");const h=new de(i,a,s,e,t),u=f=>{(f.key==="ArrowUp"||f.key==="ArrowDown")&&f.preventDefault(),s.add(f.key)},g=f=>{s.delete(f.key)};return document.addEventListener("keydown",u),document.addEventListener("keyup",g),h.loop(),()=>{h.stop(),window.removeEventListener("resize",m),document.removeEventListener("keydown",u),document.removeEventListener("keyup",g)}},ue=a=>{const e=$();if(!e){location.hash="/auth";return}a.className="",a.style.cssText="";const t=document.createElement("main");t.className="min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",t.innerHTML=`
    <header class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div class="flex-1">
            <p class="uppercase text-xs tracking-wider text-slate-400 mb-3 font-bold">Pong Oyunu</p>
            <h1 class="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight pb-2 leading-tight">Ping Pong</h1>
            <p class="text-slate-400 mt-4 text-lg">W/S ve ↑/↓ tuşlarıyla raketleri kontrol edebilirsin.</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div class="rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kontroller</p>
              <div class="space-y-1 text-sm text-slate-300">
                <p><span class="font-semibold text-sky-400">Oyuncu A:</span> W / S</p>
                <p><span class="font-semibold text-sky-400">Oyuncu B:</span> ↑ / ↓</p>
              </div>
            </div>
            <button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-red-400 border-2 border-red-500/30 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 hover:scale-105 transform self-start lg:self-auto" type="button" data-action="leave">Oyundan Çık</button>
          </div>
        </div>
      </div>
    </header>
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="relative flex flex-col items-center">
        <div class="relative w-full max-w-4xl space-y-4">
        <div class="flex flex-col gap-3">
          <div class="flex gap-2 justify-center items-center">
            <button class="px-4 py-2 rounded-lg font-bold text-sm bg-slate-200/80 text-slate-900 border border-slate-300 shadow-sm hover:bg-slate-100 transition" type="button" data-mode="offline">Offline Oyna</button>
            <button class="px-4 py-2 rounded-lg font-bold text-sm bg-sky-500/90 text-white border border-sky-300 shadow-sm hover:bg-sky-600 transition" type="button" data-mode="online">Online Oyna</button>
          </div>
          <div class="flex gap-4 justify-center items-center">
              <div class="px-6 py-3 rounded-xl bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 ring-1 ring-white/10 pointer-events-none">
                <span class="text-2xl font-extrabold text-sky-600" data-score="a">A: 0</span>
              </div>
              <div class="px-6 py-3 rounded-xl bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 ring-1 ring-white/10 pointer-events-none">
                <span class="text-2xl font-extrabold text-indigo-600" data-score="b">B: 0</span>
              </div>
              <div class="px-4 py-3 rounded-xl bg-white/95 text-slate-700 border border-white/50 min-w-[180px]" data-status="connection">Oda oluştur veya katıl.</div>
          </div>
          <div class="flex flex-col gap-2" data-section="lobby">
            <div class="flex gap-2 justify-center items-center">
              <button class="px-4 py-2 rounded-lg font-bold text-sm bg-sky-500/90 text-white border border-sky-300 shadow-sm hover:bg-sky-600 transition" type="button" data-action="create-room">Oda Oluştur</button>
              <input class="px-3 py-2 rounded-lg border border-slate-300 bg-white/90 text-slate-800 placeholder-slate-400" type="text" maxlength="8" placeholder="Oda Kodu" data-field="room-code" />
              <button class="px-4 py-2 rounded-lg font-bold text-sm bg-emerald-500/90 text-white border border-emerald-300 shadow-sm hover:bg-emerald-600 transition" type="button" data-action="join-room">Odaya Katıl</button>
            </div>
          </div>
        </div>
          <canvas class="w-full h-auto rounded-2xl shadow-2xl border-2 border-white/20 bg-slate-800/50"></canvas>
        </div>
      </div>
    </section>
  `,a.appendChild(t);const r=t.querySelector("canvas"),s=t.querySelector('[data-score="a"]'),i=t.querySelector('[data-score="b"]');if(!r||!s||!i)throw new Error("Oyun bileşenleri oluşturulamadı.");const n=t.querySelector('[data-action="create-room"]'),m=t.querySelector('[data-action="join-room"]'),h=t.querySelector('[data-field="room-code"]'),u=t.querySelector('[data-status="connection"]'),g=t.querySelector('[data-mode="offline"]'),f=t.querySelector('[data-mode="online"]'),b=t.querySelector('[data-section="lobby"]');if(!n||!m||!h||!u||!g||!f||!b)throw new Error("Oyun lobisi oluşturulamadı.");let c=()=>{};const o=x=>{c(),x==="offline"?(u.textContent="Offline mod (AI).",n.disabled=!0,m.disabled=!0,h.disabled=!0,g.classList.add("bg-slate-100"),f.classList.remove("bg-slate-100"),b.style.display="none",c=he(r,s,i)):(u.textContent="Oda oluştur veya katıl.",n.disabled=!1,m.disabled=!1,h.disabled=!1,g.classList.remove("bg-slate-100"),f.classList.add("bg-slate-100"),b.style.display="block",c=le(r,s,i,{createButton:n,joinButton:m,roomInput:h,statusEl:u},e))};g.addEventListener("click",()=>o("offline")),f.addEventListener("click",()=>o("online")),o("offline");const l=t.querySelector('[data-action="leave"]');return l==null||l.addEventListener("click",()=>{location.hash="/dashboard"}),()=>{c()}},me=[2,4,8,16,32],pe=a=>{if(!a.bracket||a.bracket.rounds.length===0)return'<p class="text-slate-400 text-lg text-center py-8">Bracket oluşturulduğunda burada görünecek.</p>';const[e]=a.bracket.rounds;return`
    <div class="space-y-4">
      <h3 class="text-xl font-bold text-slate-900 mb-4">Turnuva Eşleşmeleri</h3>
      ${e.matches.map(t=>`
          <div class="rounded-xl bg-slate-50/50 backdrop-blur-sm p-6 border-2 border-slate-200 shadow-md hover:shadow-lg transition-all duration-200">
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">Match #${t.match}</span>
            </div>
            <div class="flex items-center justify-center gap-4">
              <span class="px-4 py-2 rounded-lg bg-white/80 text-slate-900 font-semibold shadow-sm">${t.playerA.alias}${t.playerA.isAi?" (AI)":""}</span>
              <span class="text-slate-500 font-bold">vs</span>
              <span class="px-4 py-2 rounded-lg bg-white/80 text-slate-900 font-semibold shadow-sm">${t.playerB.alias}${t.playerB.isAi?" (AI)":""}</span>
            </div>
          </div>
        `).join("")}
    </div>
  `},be=a=>{const e=$();if(!e){location.hash="/auth";return}a.className="",a.style.cssText="";const t=document.createElement("main");t.className="min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",t.innerHTML=`
    <header class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div class="flex-1">
            <p class="uppercase text-xs tracking-wider text-slate-400 mb-3 font-bold">Turnuvalar</p>
            <h1 class="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight pb-2 leading-tight">Turnuvalar</h1>
            <p class="text-slate-400 mt-4 text-lg">Yeni turnuva oluştur veya mevcut turnuvalara katıl.</p>
          </div>
          <div class="flex gap-3 flex-wrap justify-end w-full sm:w-auto">
            <button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-slate-300 border-2 border-slate-500/30 transition-all duration-300 hover:bg-slate-500/20 hover:border-slate-500/50 hover:text-white hover:scale-105 transform" type="button" data-action="dashboard">Dashboard'a Dön</button>
          </div>
        </div>
      </div>
    </header>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-2 mb-8 border-b border-slate-700/50">
        <button class="px-6 py-3 font-bold text-sm rounded-t-xl transition-all duration-300 bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg" data-tab="create">Turnuva Oluştur</button>
        <button class="px-6 py-3 font-bold text-sm rounded-t-xl transition-all duration-300 bg-white/10 backdrop-blur-sm text-slate-400 border-b-2 border-transparent hover:text-slate-300 hover:bg-white/20" data-tab="list">Aktif Turnuvalar</button>
      </div>
      <section data-tab-panel="create">
        <div class="rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10">
          <h2 class="text-3xl font-extrabold text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-600 after:rounded-full">Yeni Turnuva Oluştur</h2>
          <form class="flex flex-col gap-6" data-form="create">
            <label class="flex flex-col gap-3">
              <span class="text-sm font-bold text-slate-800 tracking-wide">Turnuva adı</span>
              <input 
                type="text" 
                name="name" 
                placeholder="Örn. Akşam Ligi" 
                required 
                minlength="3" 
                maxlength="64"
                class="w-full px-5 py-4 rounded-xl border-2 border-slate-300 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200 hover:shadow-md hover:border-slate-400"
              />
            </label>
            <label class="flex flex-col gap-3">
              <span class="text-sm font-bold text-slate-800 tracking-wide">Maksimum oyuncu (2^x)</span>
              <select 
                name="maxPlayers"
                class="w-full px-5 py-4 rounded-xl border-2 border-slate-300 bg-white/50 backdrop-blur-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200 hover:shadow-md hover:border-slate-400"
              >
                ${me.map(c=>`<option value="${c}">${c} oyuncu</option>`).join("")}
              </select>
            </label>
            <button 
              class="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white transition-all duration-300 hover:from-sky-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-sky-500/50 hover:scale-105 transform self-start" 
              type="submit"
            >
              Turnuvayı Oluştur
            </button>
            <p class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium min-h-[48px] hidden" data-status="create"></p>
          </form>
        </div>
      </section>
      <section class="hidden" data-tab-panel="list">
        <div data-list class="space-y-6"></div>
        <p class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium min-h-[48px] hidden mt-6" data-status="list"></p>
      </section>
    </div>
  `,a.appendChild(t);const r=c=>{t.querySelectorAll("[data-tab]").forEach(o=>{o.dataset.tab===c?(o.classList.remove("bg-white/10","text-slate-400","border-transparent","hover:text-slate-300","hover:bg-white/20"),o.classList.add("bg-gradient-to-r","from-sky-500","to-indigo-600","text-white","shadow-lg")):(o.classList.remove("bg-gradient-to-r","from-sky-500","to-indigo-600","text-white","shadow-lg"),o.classList.add("bg-white/10","backdrop-blur-sm","text-slate-400","border-b-2","border-transparent","hover:text-slate-300","hover:bg-white/20"))}),t.querySelectorAll("[data-tab-panel]").forEach(o=>{o.dataset.tabPanel===c?o.classList.remove("hidden"):o.classList.add("hidden")})};t.querySelectorAll("[data-tab]").forEach(c=>{c.addEventListener("click",()=>{r(c.dataset.tab==="list"?"list":"create"),c.dataset.tab==="list"&&u()})});const s=t.querySelector('[data-action="dashboard"]');s==null||s.addEventListener("click",()=>{location.hash="/dashboard"});const i=t.querySelector('[data-status="create"]'),n=t.querySelector('[data-status="list"]'),m=t.querySelector("[data-list]"),h=(c,o,l="")=>{if(c)if(c.classList.remove("bg-green-100","text-green-900","border-green-400","bg-red-100","text-red-900","border-red-400","bg-blue-100","text-blue-900","border-blue-400","hidden","shadow-lg","border-2"),c.innerHTML="",c.style.display="flex",c.classList.remove("hidden"),o==="loading")c.innerHTML=`
        <svg class="animate-spin h-5 w-5 text-blue-600 flex-shrink-0" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="font-semibold">${l||"Yükleniyor..."}</span>
      `,c.classList.add("bg-blue-100","text-blue-900","border-blue-400","border-2");else if(l)o==="success"?(c.innerHTML=`
        <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-bold">${l}</span>
      `,c.classList.add("bg-green-100","text-green-900","border-green-400","border-2","shadow-lg"),setTimeout(()=>{c.classList.add("hidden"),c.style.display="none",c.textContent=""},5e3)):o==="error"&&(c.innerHTML=`
        <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-bold">${l}</span>
      `,c.classList.add("bg-red-100","text-red-900","border-red-400","border-2","shadow-lg"));else{c.textContent="",c.classList.add("hidden"),c.style.display="none";return}},u=async()=>{h(n,"loading","Turnuvalar yükleniyor...");try{const c=await fetch("/api/tournaments",{credentials:"include"});if(!c.ok){c.status===401&&(location.hash="/auth"),h(n,"error","Turnuvalar alınamadı.");return}const o=await c.json();if(h(n,"error",""),!o.length){m.innerHTML='<p class="text-slate-400 text-lg text-center py-12">Aktif turnuva yok.</p>';return}m.innerHTML=o.map(l=>`
            <article class="rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl border border-white/20 ring-1 ring-white/10 ${l.status==="active"?"ring-2 ring-green-500/50":""}">
              <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                <div class="flex-1">
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${l.status==="active"?"bg-green-100 text-green-800":"bg-yellow-100 text-yellow-800"}">
                    ${l.status==="active"?"Başladı":"Beklemede"}
                  </span>
                  <h3 class="text-2xl font-extrabold text-slate-900 mb-2">${l.name}</h3>
                  <p class="text-slate-600 text-sm">Sahip: ${l.ownerNickname??"Bilinmiyor"}</p>
                </div>
                <div class="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-lg shadow-lg">
                  ${l.currentPlayers}/${l.maxPlayers}
                </div>
              </header>
              <div>
                ${l.status==="pending"?`
                      <div class="flex flex-col sm:flex-row gap-3">
                        <form data-join="${l.id}" class="flex-1">
                          <button class="w-full px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white transition-all duration-300 hover:from-sky-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-sky-500/50" type="submit">Turnuvaya Katıl</button>
                        </form>
                        ${l.ownerId===e.id?`<button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-sky-600 border-2 border-sky-500/30 transition-all duration-300 hover:bg-sky-500/20 hover:border-sky-500/50 hover:scale-105 transform" data-action="start" data-id="${l.id}">Turnuvayı Başlat</button>`:""}
                      </div>
                    `:pe(l)}
              </div>
            </article>
          `).join(""),m.querySelectorAll("[data-join]").forEach(l=>{l.addEventListener("submit",x=>{x.preventDefault();const S=Number(l.dataset.join);g(S)})}),m.querySelectorAll('[data-action="start"]').forEach(l=>{l.addEventListener("click",()=>{const x=Number(l.dataset.id);f(x)})})}catch(c){console.warn("Turnuvalar alınamadı:",c),h(n,"error","Turnuvalar alınamadı.")}},g=async c=>{h(n,"loading","Katılım gönderiliyor...");try{const o=await fetch(`/api/tournaments/${c}/join`,{method:"POST",credentials:"include"});if(!o.ok){const l=await o.json().catch(()=>null);h(n,"error",(l==null?void 0:l.message)??"Katılım başarısız oldu.");return}h(n,"success","Turnuvaya katıldın!"),await u()}catch(o){console.warn("Katılım hatası:",o),h(n,"error","Katılım sırasında hata oluştu.")}},f=async c=>{h(n,"loading","Turnuva başlatılıyor...");try{const o=await fetch(`/api/tournaments/${c}/start`,{method:"POST",credentials:"include"});if(!o.ok){const l=await o.json().catch(()=>null);h(n,"error",(l==null?void 0:l.message)??"Turnuva başlatılamadı.");return}h(n,"success","Turnuva başlatıldı!"),await u()}catch(o){console.warn("Başlatma hatası:",o),h(n,"error","Turnuva başlatılırken hata oluştu.")}},b=t.querySelector('[data-form="create"]');b==null||b.addEventListener("submit",async c=>{if(c.preventDefault(),!b.checkValidity()){b.reportValidity();return}h(i,"loading","Turnuva oluşturuluyor...");const o=new FormData(b);try{const l=await fetch("/api/tournaments",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({name:o.get("name"),maxPlayers:Number(o.get("maxPlayers"))})});if(!l.ok){const x=await l.json().catch(()=>null);h(i,"error",(x==null?void 0:x.message)??"Turnuva oluşturulamadı.");return}h(i,"success","Turnuva oluşturuldu!"),b.reset(),r("list"),await u()}catch(l){console.warn("Turnuva oluşturma hatası:",l),h(i,"error","Turnuva oluşturulamadı.")}}),u()},H=document.getElementById("app");if(!H)throw new Error("Uygulama için kök element bulunamadı.");const L=new G(H);L.register({path:"/auth",render:Q});L.register({path:"/dashboard",render:ae});L.register({path:"/game",render:ue});L.register({path:"/tournament",render:be});const P=$(),N=location.hash.replace(/^#/,"").split("?")[0]||"",fe=["/game","/tournament"];fe.includes(N)?L.navigate(P?"/dashboard":"/auth",{replace:!0}):!N&&P&&L.navigate("/dashboard",{replace:!0});L.init();
