# Sanitization - protection from user inputs

Die Bereinigung (potenzielle script injections) von eingehenden User Daten wird im backend im Rahmen der Validierung gemacht bevor die Daten in die Datenbank geschrieben wird.
Im Frontend werden die Input Felder mit Namen (Grid Name, Update Grid Name, User Name) bereinigt. E-Mail Felder haben eine E-Mail Validierung, mit dieser Hürde kann keine injection gemacht werden.

Passwörter oder Passwort Bestätigungen werden nicht automatisch bereinigt, damit User nicht mit Änderungen an ihren Passwörtern überrascht werden. Das backend sichert diese Passwort Eingaben mit:

- Hash::make() (bcrypt standardmäßig)
- Rules\Password::defaults() (Laravel-Standardrichtlinie)
- confirmed (Stimmt mit password_confirmation überein)
- Kein Speichern im Klartext
