class AddColumnToCalculator < ActiveRecord::Migration
  def change
    add_column :calculators,:user_id,:number
  end
end
