# Hive-inspired relief tile prototypes

Original artwork and geometry; an unofficial design study, not an official Hive product.

- Units: mm. Hex diameter 50 corner-to-corner, 43.301 across flats.
- Deck 10 high, insect up to 5 above deck, total 15. Perimeter top chamfer 0.6, bottom chamfer 0.3.
- Underside: centred circular recess, mouth diameter 17.6, 8 deep, 45-degree walls, diameter 1.6 at the closed roof. Roof thickness at least 2 below deck.
- Every insect fits h <= min(5, 8 - radius), in mm relative to the deck. Socket boundary is radius + height = 8.8, giving 0.8 mm nominal radial clearance (about 0.57 mm normal to the cone). Planar triangulation stays inside this convex envelope.
- Any model fits over any other at arbitrary rotation, nominally. Hex sides align every 60 degrees. Broad flat underside rim rests on the lower deck; this is loose nesting, not a snap fit or positive lock. Stack pitch 10; a stack of n tiles is 10*n+5 high. A two-tile stack is 25 high.
- Keep the underside down on the bed. Starting settings to calibrate: PLA, 0.4 nozzle, 0.16–0.20 layers, 3–4 walls, 5 top/bottom layers, 15–25% infill. No supports intended; inspect the 1.6 mm final bridge and 45-degree socket in the slicer. These settings have not been physically tested.
- Print two different insects first. Inspect the roof, check seating at all six hex orientations, and slide beside other tiles. Compensate elephant's foot in your slicer. Test a five-tile stack (all four beetles above another tile, 55 mm high) and handling before printing a full set.
- Print one style, 11 tiles/player: queen x1, ant x3, beetle x2, grasshopper x3, spider x2. Two sets in different single filament colors distinguish players; insect relief requires no paint or color change. The 15 files are five insect types in three alternative styles, not a complete game set.
- Rounded is organic; faceted uses polygonal body footprints; terraced quantizes relief in 0.6 mm bands. All are deck-backed bas-reliefs with no unsupported legs, antennae or undercuts. Spider has eight legs; other types have six.

Regenerate with Python 3, no packages: `python3 research/hive-printable/generate.py` from the repository root. Validates closed edges, winding, nondegenerate faces, Euler characteristic, positive volume, height and universal fit envelope. Preview meshes are lower-resolution approximations of the same geometry; use the full STL in your slicer. Geometric checks are not print or physical fit tests.
