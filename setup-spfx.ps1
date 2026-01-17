
Write-Host "Deleting old node_modules and package-lock.json..."
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

Write-Host "Logging out from npm (if logged in)..."
npm logout

Write-Host "Please login to npm if prompted..."
npm login

Write-Host "Installing @pnp/sp and @pnp/graph..."
npm install @pnp/sp@3.20.0 --save --legacy-peer-deps
npm install @pnp/graph@3.20.0 --save --legacy-peer-deps

Write-Host "Installing @types/react and @types/react-dom..."
npm install @types/react @types/react-dom --save-dev

Write-Host "Cleaning and building the SPFx project..."
gulp clean
gulp build

Write-Host "✅ Setup complete. You can now run 'gulp serve'."
