package SpectraSystems.Nexus.controllers;

import org.hibernate.service.internal.ProvidedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import SpectraSystems.Nexus.models.Provider;
import SpectraSystems.Nexus.services.ProviderServices;

import java.util.List;

@RestController
@RequestMapping("/providers")
public class ProviderController {

    private final ProviderServices providerService;

    @Autowired
    public ProviderController(ProviderServices providerService) {
        this.providerService = providerService;
    }

    @GetMapping
    public ResponseEntity<List<Provider>> getAllProviders() {
        List<Provider> providers = providerService.getAllProviders();
        return new ResponseEntity<>(providers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Provider> getProviderById(@PathVariable Long id) {
        return providerService.getProviderById(id)
                .map(provider -> new ResponseEntity<>(provider, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Provider> createProvider(@RequestBody Provider provider) {
        Provider createdProvider = providerService.createProvider(provider);
        return new ResponseEntity<>(createdProvider, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        providerService.deleteProvider(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

