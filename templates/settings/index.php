<div id="app-settings">
	<div id="app-settings-header">
		<button class="settings-button"
				data-apps-slide-toggle="#app-settings-content"
		></button>
	</div>
	<div id="app-settings-content">
		<p><input id="filter-albums-to-map" type="checkbox" class="checkbox" checked><label for="filter-albums-to-map"><?php p($l->t('Nur sichtbare Fotoalben anzeigen'));?></label></p>
		<p><input id="show-album-tracks" type="checkbox" class="checkbox"><label for="show-album-tracks"><?php p($l->t('Routen der Fotoalben anzeigen'));?></label>
		<!-- Your settings in here -->
	</div>
</div>
