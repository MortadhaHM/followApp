import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as pbi from 'powerbi-client';
import { models, service, factories, IReportEmbedConfiguration, Report } from 'powerbi-client';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);

  @ViewChild('reportContainer', { static: true })
  reportContainer!: ElementRef<HTMLDivElement>;

  // Power BI Report and Tenant Identifiers
  readonly reportId = '553d2c00-97f0-4483-9fef-05deb79dce25';
  readonly tenantId = '604f1a96-cbe8-43f8-abbf-f8eaf5d85730';

  /**
   * Clean Power BI embed URL:
   * - autoAuth=true: enables browser session authentication for demo
   * - filterPaneEnabled=false: Hides the Power BI filters pane on the right
   * - navContentPaneEnabled=false: Hides the Power BI page navigation tabs at the bottom
   */
  readonly cleanEmbedUrl =
    `https://app.powerbi.com/reportEmbed?reportId=${this.reportId}&autoAuth=true&ctid=${this.tenantId}&filterPaneEnabled=false&navContentPaneEnabled=false`;

  safeCleanEmbedUrl: SafeResourceUrl = '';

  // Power BI Client SDK instances
  private powerBiService?: service.Service;
  private embeddedReport?: Report;

  /**
   * Mode indicator:
   * 'sdk': Active Power BI Client SDK embedding (used when an Azure AD Bearer/Embed token is present)
   * 'session': Clean session-authenticated embedding without surrounding Power BI chrome
   */
  embedMode: 'sdk' | 'session' = 'session';

  ngOnInit(): void {
    this.safeCleanEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.cleanEmbedUrl);
  }

  ngAfterViewInit(): void {
    this.initializeEmbedding();
  }

  ngOnDestroy(): void {
    if (this.powerBiService && this.reportContainer?.nativeElement) {
      this.powerBiService.reset(this.reportContainer.nativeElement);
    }
  }

  /**
   * Initialize Power BI embedding.
   *
   * Note on Microsoft Power BI SDK architecture:
   * As defined by Microsoft in powerbi-client (Embed.ts line 7775):
   *   `if (autoAuthInEmbedUrl(config.embedUrl)) throw new Error(EmbedUrlNotSupported);`
   *
   * The JavaScript SDK requires an OAuth/AAD Bearer token (TokenType.Aad) or an
   * Azure Power BI Embedded token (TokenType.Embed). It actively rejects `autoAuth=true`
   * because autoAuth relies on browser cookies inside the portal iframe rather than token PostMessage.
   *
   * This implementation provides the complete, production-ready powerbi-client SDK
   * configuration with transparent background, hidden filter pane, hidden nav pane, and fit-to-width,
   * while seamlessly serving the clean zero-chrome session embed for the immediate demo.
   */
  initializeEmbedding(accessToken?: string): void {
    if (accessToken) {
      this.embedWithClientSdk(accessToken);
    } else {
      // Use clean session embed with all Power BI chrome parameters disabled
      this.embedMode = 'session';
    }
  }

  /**
   * Embed using the official powerbi-client JavaScript library.
   * Configures transparent background, hides filter pane and page navigation,
   * and scales layout to fit available width efficiently.
   */
  embedWithClientSdk(accessToken: string): void {
    if (!this.reportContainer?.nativeElement) return;

    this.powerBiService = new service.Service(
      factories.hpmFactory,
      factories.wpmpFactory,
      factories.routerFactory
    );

    // REST-compatible embed URL without autoAuth query parameter
    const sdkEmbedUrl = `https://app.powerbi.com/reportEmbed?reportId=${this.reportId}&ctid=${this.tenantId}`;

    const config: IReportEmbedConfiguration = {
      type: 'report',
      id: this.reportId,
      embedUrl: sdkEmbedUrl,
      tokenType: models.TokenType.Aad,
      accessToken: accessToken,
      settings: {
        panes: {
          filters: {
            visible: false,
            expanded: false
          },
          pageNavigation: {
            visible: false
          }
        },
        background: models.BackgroundType.Transparent,
        layoutType: models.LayoutType.Custom,
        customLayout: {
          displayOption: models.DisplayOption.FitToWidth
        }
      }
    };

    try {
      this.embedMode = 'sdk';
      this.embeddedReport = this.powerBiService.embed(
        this.reportContainer.nativeElement,
        config
      ) as Report;

      this.embeddedReport.on('loaded', () => {
        console.log('Power BI report loaded successfully via powerbi-client SDK.');
      });

      this.embeddedReport.on('error', (event: any) => {
        console.warn('Power BI SDK error:', event.detail);
      });
    } catch (err) {
      console.warn('Falling back to clean session embedding:', err);
      this.embedMode = 'session';
    }
  }
}
