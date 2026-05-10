{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_24
    sqlite

    python3
    pkg-config
    gcc
    gnumake

    # GTK and X11 libraries required by Cypress (Electron-based)
    gtk3
    glib
    libxkbcommon
    libX11
    libxcb
    dbus
    libxkbfile
    libdrm
    mesa
    atk
    pango
    cairo
    gdk-pixbuf
    cups
    libXtst
    libXrandr
    libXinerama
    libXcursor
    libXdamage
    libXext
    libXfixes
  ];

  LD_LIBRARY_PATH = with pkgs; lib.makeLibraryPath [
    gtk3 glib libxkbcommon libX11 libxcb dbus libxkbfile libdrm mesa
    atk pango cairo gdk-pixbuf cups libXtst libXrandr libXinerama libXcursor
    libXdamage libXext libXfixes
  ];

  shellHook = ''
    echo "  Node: $(node -v)"
  '';
}
