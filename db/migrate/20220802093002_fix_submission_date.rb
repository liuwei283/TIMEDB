class FixSubmissionDate < ActiveRecord::Migration[6.0]
  def change
    rename_column :projects, :submisson_date, :submission_date
  end
end
