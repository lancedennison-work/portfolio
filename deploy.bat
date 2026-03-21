@echo off
setlocal

:: Path to the zip file — edit this if files.zip is somewhere else
set ZIP="%~dp0files.zip"
set ROOT=%~dp0

:: Extract everything flat into a temp folder
set TEMP_DIR=%ROOT%_extract_temp
mkdir "%TEMP_DIR%"
powershell -command "Expand-Archive -Path %ZIP% -DestinationPath '%TEMP_DIR%' -Force"

:: Root-level HTML files
for %%f in (index.html about.html projects.html current-project.html) do (
    if exist "%TEMP_DIR%\%%f" move /Y "%TEMP_DIR%\%%f" "%ROOT%%%f"
)

:: css/
if not exist "%ROOT%css" mkdir "%ROOT%css"
if exist "%TEMP_DIR%\style.css" move /Y "%TEMP_DIR%\style.css" "%ROOT%css\style.css"

:: components/
if not exist "%ROOT%components" mkdir "%ROOT%components"
for %%f in (nav.html footer.html components.js) do (
    if exist "%TEMP_DIR%\%%f" move /Y "%TEMP_DIR%\%%f" "%ROOT%components\%%f"
)

:: projects/
if not exist "%ROOT%projects" mkdir "%ROOT%projects"
for %%f in (ThroughtheFog.html RGBYrunner.html TftBdeck.html Classes.html) do (
    if exist "%TEMP_DIR%\%%f" move /Y "%TEMP_DIR%\%%f" "%ROOT%projects\%%f"
)

:: Clean up temp folder
rmdir /S /Q "%TEMP_DIR%"

echo Done.
pause