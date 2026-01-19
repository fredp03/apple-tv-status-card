# Apple TV Status Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

A custom Home Assistant Lovelace card to display Apple TV or Samsung TV status in a compact format.

## Features

- Compact design showing device name and current status
- Displays app name or media title when playing
- Support for Apple TV and Samsung TV icons
- Click to open more-info dialog
- Custom tap actions support
- Overlay blend mode for visual effect

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant
2. Go to "Frontend" section
3. Click the three dots menu → "Custom repositories"
4. Add this repository URL with category "Dashboard"
5. Install "Apple TV Status Card"
6. Restart Home Assistant

### Manual Installation

1. Download `apple-tv-status-card.js`
2. Copy to `/config/www/apple-tv-status-card.js`
3. Add resource in Lovelace:
   ```yaml
   resources:
     - url: /local/apple-tv-status-card.js
       type: module
   ```

## Configuration

### Apple TV Example
```yaml
type: custom:apple-tv-status-card
entity: media_player.apple_tv
name: Apple TV
type: apple_tv
```

### Samsung TV Example
```yaml
type: custom:apple-tv-status-card
entity: media_player.samsung_tv
name: Frame TV
type: samsung_tv
```

### With Custom Tap Action
```yaml
type: custom:apple-tv-status-card
entity: media_player.apple_tv
name: Apple TV
type: apple_tv
tap_action:
  action: call-service
  service: media_player.media_play_pause
  service_data:
    entity_id: media_player.apple_tv
```

## Options

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `entity` | string | Yes | Media player entity ID |
| `name` | string | No | Display name (default: 'Apple TV') |
| `type` | string | No | Device type: `apple_tv`, `samsung_tv`, or `tv` (default: 'apple_tv') |
| `tap_action` | object | No | Custom tap action configuration |

## Tap Action Options

| Name | Type | Description |
|------|------|-------------|
| `action` | string | Action type: `more-info` or `call-service` |
| `service` | string | Service to call (for `call-service` action) |
| `service_data` | object | Service data (for `call-service` action) |
