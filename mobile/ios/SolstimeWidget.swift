import WidgetKit
import SwiftUI

struct SolstimeWidgetEntry: TimelineEntry {
    let date: Date
    let snapshot: DialSnapshot
    let privacyState: WidgetPrivacyState
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
            privacyState: .ready
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (SolstimeWidgetEntry) -> Void) {
        completion(
            SolstimeWidgetEntry(
                date: .now,
                snapshot: .preview,
                privacyState: context.isPreview ? .ready : .stale
            )
        )
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SolstimeWidgetEntry>) -> Void) {
        let entry = SolstimeWidgetEntry(
            date: .now,
            snapshot: .preview,
            privacyState: .stale
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
        }
        .containerBackground(for: .widget) {
            Color(red: 0.055, green: 0.075, blue: 0.065)
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
    SolstimeWidgetEntry(date: .now, snapshot: .preview, privacyState: .ready)
}
