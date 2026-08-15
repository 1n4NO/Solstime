import WidgetKit
import SwiftUI

struct SolstimeWidgetEntry: TimelineEntry {
    let date: Date
    let snapshot: DialSnapshot
    let privacyState: WidgetPrivacyState
    let cycleMarker: CycleMarker?
}

enum CycleMarker {
    case period(progress: Double)
    case ovulation(progress: Double)

    var color: Color {
        switch self {
        case .period: return Color(red: 0.85, green: 0.22, blue: 0.28)
        case .ovulation: return Color(red: 0.95, green: 0.48, blue: 0.65)
        }
    }

    var opacity: Double {
        switch self {
        case let .period(progress): return max(0.14, min(1, 1 - progress))
        case let .ovulation(progress):
            let normalized = max(0, min(1, progress))
            return max(0.14, normalized <= 0.5 ? normalized * 2 : (1 - normalized) * 2)
        }
    }
}

enum WidgetPrivacyState {
    case ready
    case stale
    case locked
    case signedOut
    case unavailable
}

struct SolstimeWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> SolstimeWidgetEntry {
        SolstimeWidgetEntry(
            date: .now,
            snapshot: .preview,
            privacyState: .ready,
            cycleMarker: .period(progress: 0.25)
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (SolstimeWidgetEntry) -> Void) {
        completion(
            SolstimeWidgetEntry(
                date: .now,
                snapshot: .preview,
                privacyState: context.isPreview ? .ready : .stale,
                cycleMarker: .period(progress: 0.25)
            )
        )
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SolstimeWidgetEntry>) -> Void) {
        let entry = SolstimeWidgetEntry(
            date: .now,
            snapshot: .preview,
            privacyState: .stale,
            cycleMarker: .period(progress: 0.25)
        )
        let refresh = Calendar.current.date(byAdding: .minute, value: 15, to: .now) ?? .now.addingTimeInterval(900)
        completion(Timeline(entries: [entry], policy: .after(refresh)))
    }
}

struct SolstimeWidgetView: View {
    let entry: SolstimeWidgetProvider.Entry

    var body: some View {
        ZStack {
            Color(red: 0.055, green: 0.075, blue: 0.065)

            switch entry.privacyState {
            case .locked:
                Label("Hidden while locked", systemImage: "lock.fill")
            case .signedOut:
                Label("Open Solstime", systemImage: "arrow.up.right")
            case .unavailable:
                Text("Pro unavailable")
            default:
                VStack(spacing: 5) {
                    Text(entry.snapshot.timezoneName)
                        .font(.caption2.weight(.semibold))
                        .foregroundStyle(Color(red: 0.95, green: 0.68, blue: 0.35))
                        .lineLimit(1)

                    Text(entry.snapshot.localTime)
                        .font(.system(size: 31, weight: .regular, design: .rounded))
                        .monospacedDigit()
                        .foregroundStyle(.white.opacity(0.94))
                        .accessibilityLabel("Local time \(entry.snapshot.localTime)")

                    Text(entry.snapshot.dateLabel)
                        .font(.caption2.monospaced())
                        .foregroundStyle(.white.opacity(0.62))

                    if entry.privacyState == .stale || entry.snapshot.isStale {
                        Text("saved data")
                            .font(.caption2)
                            .foregroundStyle(.white.opacity(0.48))
                    }
                }
            }

            if let cycleMarker = entry.cycleMarker {
                Circle()
                    .fill(cycleMarker.color)
                    .opacity(cycleMarker.opacity)
                    .frame(width: 10, height: 10)
                    .overlay(Circle().stroke(.white.opacity(0.18), lineWidth: 0.5))
                    .accessibilityLabel(cycleMarker.accessibilityLabel)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
                    .padding(12)
            }
        }
        .containerBackground(for: .widget) {
            Color(red: 0.055, green: 0.075, blue: 0.065)
        }
    }
}

private extension CycleMarker {
    var accessibilityLabel: String {
        switch self {
        case .period: return "Period tracker indicator"
        case .ovulation: return "Ovulation estimate indicator"
        }
    }
}

struct SolstimeWidget: Widget {
    let kind = "SolstimeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SolstimeWidgetProvider()) { entry in
            SolstimeWidgetView(entry: entry)
        }
        .configurationDisplayName("Solstime")
        .description("A quiet view of your day.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular, .accessoryRectangular])
    }
}

#Preview(as: .systemSmall) {
    SolstimeWidget()
} timeline: {
    SolstimeWidgetEntry(date: .now, snapshot: .preview, privacyState: .ready, cycleMarker: .ovulation(progress: 0.5))
}
