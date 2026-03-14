{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = with pkgs; [
    nodejs_24
    sqlite

    # Node native addon toolchain (for better-sqlite3)
    python3
    pkg-config
    gcc
    gnumake
  ];

  shellHook = ''
    echo "  Node: $(node -v)"
  '';
}
