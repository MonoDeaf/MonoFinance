export const AuthView = () => `
    <div class="w-full h-screen flex flex-col lg:flex-row bg-black text-white overflow-hidden font-['Host_Grotesk']">
        <!-- Left Panel: Interactive Visual -->
        <div class="lg:w-1/2 w-full h-[35vh] lg:h-full relative border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden bg-[#0a0a0a]">
            <iframe 
                src="https://www.refract.build/embed/e83b8079-bd0b-4dc1-bcf7-d70fb9045c80" 
                class="w-full h-full border-none"
                style="color-scheme: dark;"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>

        <!-- Right Panel: Login Form -->
        <div class="lg:w-1/2 w-full h-[65vh] lg:h-full bg-black flex flex-col relative">
            <div class="absolute top-6 right-6 lg:top-10 lg:right-12 z-20">
                <button id="auth-toggle-btn" class="text-[11px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest" onclick="window.toggleAuthMode()">Create an account</button>
            </div>

            <div class="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 max-w-2xl mx-auto w-full relative">
                <div class="mb-12 lg:mb-16">
                    <h2 id="auth-title" class="text-4xl lg:text-5xl font-light mb-4 tracking-tighter text-white">Login</h2>
                    <p id="auth-subtitle" class="text-gray-500 text-xs">Enter your credentials to access the vault.</p>
                </div>
                
                <form id="auth-form" onsubmit="window.handleAuth(event)" class="flex flex-col gap-8 lg:gap-10">
                    <div class="group relative">
                        <input type="email" name="email" required class="w-full bg-transparent border-b border-white/20 py-4 text-sm lg:text-base focus:outline-none focus:border-[#ccccfa] transition-all placeholder-transparent peer text-white" placeholder="Email" id="field-email">
                        <label for="field-email" class="absolute left-0 top-4 text-xs text-gray-500 uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-[#ccccfa] peer-valid:-top-2 peer-valid:text-[10px] peer-valid:text-gray-500">Email Address</label>
                    </div>
                    
                    <div class="group relative">
                        <input type="password" name="password" required class="w-full bg-transparent border-b border-white/20 py-4 text-sm lg:text-base focus:outline-none focus:border-[#ccccfa] transition-all placeholder-transparent peer text-white tracking-widest" placeholder="Password" id="field-password">
                        <label for="field-password" class="absolute left-0 top-4 text-xs text-gray-500 uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-[#ccccfa] peer-valid:-top-2 peer-valid:text-[10px] peer-valid:text-gray-500">Password</label>
                    </div>

                    <div class="flex justify-between items-center mt-2">
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <div class="w-4 h-4 border border-white/20 rounded-full flex items-center justify-center group-hover:border-[#ccccfa] transition-colors relative">
                                <input type="checkbox" class="peer appearance-none absolute inset-0 cursor-pointer" checked>
                                <div class="w-2 h-2 bg-[#ccccfa] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            </div>
                            <span class="text-[10px] lg:text-xs text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-wider font-medium">Remember me</span>
                        </label>
                        <button type="button" class="text-[10px] lg:text-xs text-gray-600 hover:text-white transition-colors uppercase tracking-wider font-medium">Forgot?</button>
                    </div>

                    <div class="pt-4 flex flex-col gap-4">
                        <button type="submit" id="auth-submit-btn" class="w-full h-14 bg-white rounded-[0.25rem] flex items-center justify-center text-black font-black text-[10px] lg:text-xs tracking-widest active:scale-95 transition-all duration-300 hover:bg-[#ccccfa]">
                            SIGN IN
                        </button>
                        
                        <div class="relative flex items-center justify-center my-1">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-white/10"></div>
                            </div>
                            <span class="relative bg-black px-4 text-[9px] text-gray-500 uppercase tracking-widest">Or</span>
                        </div>

                        <button type="button" onclick="window.handleGoogleAuth()" class="w-full h-14 border border-white/10 rounded-[0.25rem] flex items-center justify-center gap-3 text-white hover:bg-white/5 transition-all group active:scale-95">
                            <iconify-icon icon="logos:google-icon" class="text-lg"></iconify-icon>
                            <span class="text-[10px] lg:text-xs font-bold uppercase tracking-widest group-hover:text-white/90">Sign in with Google</span>
                        </button>
                    </div>
                </form>
                
                <div id="auth-error" class="mt-8 text-red-400 text-xs font-mono text-center h-4 opacity-0 transition-opacity tracking-tight"></div>
            </div>
        </div>
    </div>
`;