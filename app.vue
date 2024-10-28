<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
    :root {
        --brand-primary: #0e3a08;
        --brand-primary-color: #f9eff8;
        --active-bg: #f4f97033;
        --active-color: #ffb43b;

        --bg-color: #fffffe;
        --text-color: #000000;
        --text-disabled-color: #606060;
        --button-bg-color: #eeeee0;

        --error-bg-color: #fff5f5;
        --error-color: #c92a2a;

        --table-border: #dddddd;
        --table-header-bg: #f0f0f0;
        --table-row-even-bg: #f9f9f9;
        --table-row-odd-bg: var(--bg-color);
        --table-row-hover: #f5f5f5;
    }

    /* {{{ animations */

    .page-enter-active,
    .page-leave-active {
        transition: all 0.4s;
    }
    .page-enter-from,
    .page-leave-to {
        opacity: 0;
        filter: blur(1rem);
    }

    /* }}} */
    /* {{{ generics */

    body {
        background-color: var(--bg-color);
        margin: 0;
        padding: 0;
        color: var(--text-color);
    }

    dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 2em;
        border: 1px solid var(--table-border);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: var(--bg-color);
        color: var(--text-color);
        font-size: 1.5em;
    }
    dialog::backdrop {
        background-color: rgba(100, 100, 100, 0.5);
    }

    h1 {
        text-align: center;
    }

    button {
        cursor: pointer;
    }

    /* }}} */
    /* {{{ common components */

    .inline-text {
        display: inline;
    }
    .inline-text > p {
        display: inline;
    }

    .unit {
        font-size: 0.7em;
    }

    .form label {
        display: block;
        margin: 3px;
    }

    .main-button {
        padding: 1em;
        background-color: var(--brand-primary);
        color: var(--brand-primary-color);
        font-weight: 300;
        cursor: pointer;
    }
    .main-button:not([disabled]):hover {
        color: var(--active-color);
    }

    .default-button {
        padding: 1em;
        background-color: var(--button-bg-color);
        color: var(--text-color);
        font-weight: 300;
        cursor: pointer;
    }
    .default-button:not([disabled]):hover {
        color: var(--brand-primary);
    }

    :is(.main-button, .default-button)[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
    }

    .error-message {
        color: var(--error-color);
        background: var(--error-bg-color);
    }

    /* {{{ Table */

    .table-list {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 16px;
        text-align: left;
        border: 1px solid var(--table-border);
    }
    .table-list :is(th, td) {
        padding: 12px 15px;
        border: 1px solid var(--table-border);
    }

    .table-list th {
        background: var(--table-header-bg);
        font-weight: bold;
    }

    .table-list tr:nth-child(odd) {
        background: var(--table-row-odd-bg);
    }
    .table-list tr:nth-child(even) {
        background: var(--table-row-even-bg);
    }

    .table-list tr:hover {
        background: var(--table-row-hover);
    }

    .table-list .cell-actions {
        text-align: end;
    }

    .row-empty-table {
        text-align: center;
        font-style: italic;
    }

    /* }}} */
    /* }}} */
</style>
