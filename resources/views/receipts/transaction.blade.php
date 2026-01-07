<!doctype html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8" />
        <title>Comprovante</title>
        <style>
            * {
                box-sizing: border-box;
                font-family: Arial;
            }
            body {
                font-family: DejaVu Sans, Arial, sans-serif;
                color: #230f2b;
                margin: 0;
                padding: 32px;
                background: #ffffff;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #f3d6cc;
                padding-bottom: 16px;
                margin-bottom: 24px;
            }
            .title {
                font-size: 20px;
                font-weight: 700;
            }
            .reference {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                color: #b91c3a;
            }
            .section {
                border: 1px solid #f1e2dc;
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
            }
            .label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                color: #7a6a82;
            }
            .value {
                font-size: 15px;
                font-weight: 600;
                margin-top: 6px;
            }
            .small {
                font-size: 12px;
                color: #6a5a72;
                margin-top: 4px;
            }
            .row {
                display: flex;
                gap: 12px;
            }
            .col {
                flex: 1;
            }
            .badge {
                background: #fde2d8;
                color: #b91c3a;
                padding: 8px 12px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: 600;
            }
            .muted {
                font-size: 12px;
                color: #6a5a72;
            }
            .footer {
                margin-top: 28px;
                border-top: 1px dashed #f1e2dc;
                padding-top: 16px;
                font-size: 12px;
                color: #6a5a72;
            }
            .cta {
                display: inline-block;
                margin-top: 8px;
                padding: 8px 14px;
                border-radius: 999px;
                background: #f21d41;
                color: #ffffff;
                text-decoration: none;
                font-size: 12px;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <div class="reference">Fintech.laravel</div>
                <div class="title">{{ $transaction->description }}</div>
                <div class="muted">
                    {{ optional($transaction->created_at)->format('d/m/Y H:i') ?? '--' }}
                </div>
            </div>
            <div class="badge">
                {{ $transaction->direction === 'debit' ? 'Saida' : 'Entrada' }}
            </div>
        </div>

        <div class="row">
            <div class="section col">
                <div class="label">Valor</div>
                <div class="value">
                    R$ {{ number_format($transaction->amount_cents / 100, 2, ',', '.') }}
                </div>
                <div class="muted">Referencia {{ $reference }}</div>
            </div>
            <div class="section col">
                <div class="label">Conta</div>
                <div class="value">
                    {{ $account->branch_number }} /
                    {{ $account->account_number }}-{{ $account->account_digit }}
                </div>
                <div class="muted">Tipo {{ strtoupper($transaction->type) }}</div>
            </div>
        </div>

        <div class="row">
            <div class="section col">
                <div class="label">Origem</div>
                <div class="value">{{ $origin['name'] ?? '---' }}</div>
                <div class="small">CPF {{ $origin['cpf'] ?? '---' }}</div>
                <div class="small">Instituicao {{ $origin['institution'] ?? '---' }}</div>
                <div class="small">Tipo de conta {{ $origin['account_type'] ?? '---' }}</div>
                @if (!empty($origin['account']))
                    <div class="small">Ag/Conta {{ $origin['account'] }}</div>
                @endif
            </div>
            <div class="section col">
                <div class="label">Destino</div>
                <div class="value">{{ $destination['name'] ?? '---' }}</div>
                <div class="small">CPF {{ $destination['cpf'] ?? '---' }}</div>
                <div class="small">Instituicao {{ $destination['institution'] ?? '---' }}</div>
                <div class="small">Tipo de conta {{ $destination['account_type'] ?? '---' }}</div>
                @if (!empty($destination['account']))
                    <div class="small">Ag/Conta {{ $destination['account'] }}</div>
                @endif
                @if (!empty($destination['pix_key']))
                    <div class="small">Chave Pix {{ $destination['pix_key'] }}</div>
                @endif
            </div>
        </div>

        @php
            $meta = $transaction->meta ?? [];
        @endphp

        @if (!empty($meta['beneficiary_name']) || !empty($meta['barcode']))
            <div class="section">
                <div class="label">Detalhes adicionais</div>
                @if (!empty($meta['beneficiary_name']))
                    <div class="value">Beneficiário: {{ $meta['beneficiary_name'] }}</div>
                @endif
                @if (!empty($meta['barcode']))
                    <div class="small">Código de barras {{ $meta['barcode'] }}</div>
                @endif
            </div>
        @endif

        <div class="footer">
            <div class="value">{{ $support['company'] ?? 'Fintech.laravel' }}</div>
            <div class="small">CNPJ {{ $support['cnpj'] ?? '00.000.000/0000-00' }}</div>
            <div class="small">{{ $support['message'] ?? '' }}</div>
            <div class="small">{{ $support['hours'] ?? '' }}</div>
            <div class="small">
                Ouvidoria {{ $support['phone'] ?? '' }} · {{ $support['email'] ?? '' }}
            </div>
        </div>
    </body>
</html>
